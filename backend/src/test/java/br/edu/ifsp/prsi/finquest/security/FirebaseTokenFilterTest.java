package br.edu.ifsp.prsi.finquest.security;

import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FirebaseTokenFilterTest {

    @Mock private UserRepository userRepository;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain filterChain;

    @InjectMocks
    private FirebaseTokenFilter firebaseTokenFilter;

    @Test
    @DisplayName("Deve ignorar filtro se não houver Header Authorization")
    void shouldContinueChain_WhenNoHeader() throws Exception {
        // Cenário: Header nulo
        when(request.getHeader("Authorization")).thenReturn(null);

        // Ação
        firebaseTokenFilter.doFilterInternal(request, response, filterChain);

        // Verificação: Deve chamar o próximo filtro (chain.doFilter) sem fazer nada
        verify(filterChain).doFilter(request, response);
        // Não deve ter tentado buscar usuário
        verifyNoInteractions(userRepository);
    }

    @Test
    @DisplayName("Deve ignorar filtro se o Header não começar com Bearer")
    void shouldContinueChain_WhenHeaderInvalidFormat() throws Exception {
        // Cenário: Header existe mas formato errado
        when(request.getHeader("Authorization")).thenReturn("Basic 123456");

        // Ação
        firebaseTokenFilter.doFilterInternal(request, response, filterChain);

        // Verificação
        verify(filterChain).doFilter(request, response);
    }
}