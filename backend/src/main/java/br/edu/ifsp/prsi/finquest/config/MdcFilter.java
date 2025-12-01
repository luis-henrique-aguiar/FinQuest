package br.edu.ifsp.prsi.finquest.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class MdcFilter implements Filter {

    private static final String REQUEST_ID_KEY = "requestId";
    private static final String USER_ID_KEY = "userId";
    private static final String METHOD_KEY = "method";
    private static final String URI_KEY = "uri";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            String requestId = UUID.randomUUID().toString().substring(0, 8);
            MDC.put(REQUEST_ID_KEY, requestId);

            if (request instanceof HttpServletRequest httpRequest) {
                MDC.put(METHOD_KEY, httpRequest.getMethod());
                MDC.put(URI_KEY, httpRequest.getRequestURI());
            }

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                String userId = auth.getName();
                MDC.put(USER_ID_KEY, userId);
            } else {
                MDC.put(USER_ID_KEY, "anonymous");
            }

            chain.doFilter(request, response);

        } finally {
            MDC.clear();
        }
    }
}