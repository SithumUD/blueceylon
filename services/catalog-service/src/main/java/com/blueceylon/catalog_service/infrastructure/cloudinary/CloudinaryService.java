package com.blueceylon.catalog_service.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        if (StringUtils.hasText(cloudName) && StringUtils.hasText(apiKey) && StringUtils.hasText(apiSecret)) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));
            log.info("CloudinaryService initialized with cloud_name: {}", cloudName);
        } else if (StringUtils.hasText(System.getenv("CLOUDINARY_URL"))) {
            this.cloudinary = new Cloudinary(System.getenv("CLOUDINARY_URL"));
            log.info("CloudinaryService initialized via CLOUDINARY_URL environment variable.");
        } else {
            log.warn("Cloudinary credentials not configured. Base64/mock fallback mode active.");
        }
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (cloudinary == null) {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
        }
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "blueceylon/" + folder,
                "resource_type", "auto"
        ));
        return (String) uploadResult.get("secure_url");
    }

    public String uploadBase64(String base64Data, String folder) throws IOException {
        if (cloudinary == null) {
            return base64Data;
        }
        Map<?, ?> uploadResult = cloudinary.uploader().upload(base64Data, ObjectUtils.asMap(
                "folder", "blueceylon/" + folder,
                "resource_type", "auto"
        ));
        return (String) uploadResult.get("secure_url");
    }
}
