package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.infrastructure.cloudinary.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/catalog/media")
public class MediaUploadController {

    private final CloudinaryService cloudinaryService;

    public MediaUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        try {
            String url = cloudinaryService.uploadFile(file, folder);
            return ResponseEntity.ok(Collections.singletonMap("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}
