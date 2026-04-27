package com.zyndex.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "zyndex")
public record AppProperties(
        String frontendUrl,
        String jwtSecret,
        String mainAdminEmail,
        String mainAdminPassword,
        String mainAdminName,
        String otpMailFrom,
        String resendApiKey,
        boolean otpSmtpSecure,
        boolean exposeOtpInDevelopment,
        String uploadDir
) {
}
