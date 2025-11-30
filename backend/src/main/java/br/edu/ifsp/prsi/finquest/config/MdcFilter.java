package br.edu.ifsp.prsi.finquest.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MdcFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            String requestId = UUID.randomUUID().toString().substring(0, 8);
            MDC.put("requestId", requestId);

            if (request instanceof HttpServletRequest httpRequest) {
                MDC.put("method", httpRequest.getMethod());
                MDC.put("uri", httpRequest.getRequestURI());
            }

            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
