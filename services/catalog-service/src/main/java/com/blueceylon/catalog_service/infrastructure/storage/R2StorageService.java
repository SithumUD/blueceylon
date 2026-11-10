package com.blueceylon.catalog_service.infrastructure.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Base64;
import java.util.UUID;

@Service
public class R2StorageService {

    private static final Logger log = LoggerFactory.getLogger(R2StorageService.class);

    private final String bucketName;
    private final String publicUrl;
    private S3Client s3Client;

    public R2StorageService(
            @Value("${cloudflare.r2.account-id:}") String accountId,
            @Value("${cloudflare.r2.access-key-id:}") String accessKeyId,
            @Value("${cloudflare.r2.secret-access-key:}") String secretAccessKey,
            @Value("${cloudflare.r2.bucket-name:blueceylon-media}") String bucketName,
            @Value("${cloudflare.r2.public-url:https://media.blueceylon.lk}") String publicUrl
    ) {
        this.bucketName = bucketName;
        this.publicUrl = StringUtils.hasText(publicUrl) ? publicUrl.replaceAll("/+$", "") : "";

        if (StringUtils.hasText(accountId) && StringUtils.hasText(accessKeyId) && StringUtils.hasText(secretAccessKey)) {
            String endpoint = String.format("https://%s.r2.cloudflarestorage.com", accountId);
            this.s3Client = S3Client.builder()
                    .endpointOverride(URI.create(endpoint))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                    ))
                    .region(Region.of("auto"))
                    .serviceConfiguration(S3Configuration.builder()
                            .pathStyleAccessEnabled(true)
                            .build())
                    .build();
            log.info("R2StorageService initialized for Cloudflare R2 bucket: {}", bucketName);
        } else {
            log.warn("Cloudflare R2 credentials not configured. R2StorageService operating in fallback/mock mode.");
        }
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (s3Client == null) {
            log.warn("R2Client is unconfigured. Returning mock URL for uploaded file.");
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
        }

        String extension = getExtension(file.getOriginalFilename());
        String key = buildObjectKey(folder, extension);
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return buildPublicUrl(key);
    }

    public String uploadBase64(String base64Data, String folder) throws IOException {
        if (s3Client == null) {
            return base64Data;
        }

        String mimeType = "image/jpeg";
        String rawBase64 = base64Data;

        if (base64Data.contains(",")) {
            String[] parts = base64Data.split(",", 2);
            String metadata = parts[0];
            rawBase64 = parts[1];

            if (metadata.contains(":") && metadata.contains(";")) {
                mimeType = metadata.substring(metadata.indexOf(":") + 1, metadata.indexOf(";"));
            }
        }

        byte[] decodedBytes = Base64.getDecoder().decode(rawBase64);
        String extension = getExtensionFromMime(mimeType);
        String key = buildObjectKey(folder, extension);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(mimeType)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(decodedBytes));

        return buildPublicUrl(key);
    }

    public void deleteFile(String objectKeyOrUrl) {
        if (s3Client == null || !StringUtils.hasText(objectKeyOrUrl)) {
            return;
        }

        String key = objectKeyOrUrl;
        if (objectKeyOrUrl.startsWith("http://") || objectKeyOrUrl.startsWith("https://")) {
            if (StringUtils.hasText(publicUrl) && objectKeyOrUrl.startsWith(publicUrl)) {
                key = objectKeyOrUrl.substring(publicUrl.length()).replaceAll("^/+", "");
            } else {
                int lastSlashIndex = objectKeyOrUrl.lastIndexOf('/');
                if (lastSlashIndex != -1) {
                    key = objectKeyOrUrl.substring(lastSlashIndex + 1);
                }
            }
        }

        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteRequest);
            log.info("Deleted object from R2: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete object {} from R2: {}", key, e.getMessage());
        }
    }

    private String buildObjectKey(String folder, String extension) {
        String cleanFolder = StringUtils.hasText(folder) ? folder.replaceAll("^/+|/+$", "") : "uploads";
        String uniqueId = UUID.randomUUID().toString();
        return String.format("blueceylon/%s/%s%s", cleanFolder, uniqueId, extension);
    }

    private String buildPublicUrl(String key) {
        if (StringUtils.hasText(publicUrl)) {
            return String.format("%s/%s", publicUrl, key);
        }
        return String.format("https://%s.r2.cloudflarestorage.com/%s", bucketName, key);
    }

    private String getExtension(String originalFilename) {
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
        }
        return ".jpg";
    }

    private String getExtensionFromMime(String mimeType) {
        return switch (mimeType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "image/svg+xml" -> ".svg";
            case "video/mp4" -> ".mp4";
            case "video/quicktime" -> ".mov";
            case "application/pdf" -> ".pdf";
            default -> ".jpg";
        };
    }
}
