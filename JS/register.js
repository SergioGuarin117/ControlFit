// registro.js - ControlFit

// Función para obtener usuarios de localStorage
function obtenerUsuarios() {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
}

// Función para guardar usuario en localStorage
function guardarUsuario(nuevoUsuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Función para verificar si el usuario ya existe
function usuarioExiste(username) {
    const usuarios = obtenerUsuarios();
    return usuarios.some(u => u.username === username);
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (input && button) {
        button.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = 'Ocultar';
            } else {
                input.type = 'password';
                button.textContent = 'Mostrar';
            }
        });
    }
}

// Función para verificar fortaleza de contraseña
function verificarFortaleza() {
    const password = document.getElementById('password');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password || !strengthBar || !strengthText) return;
    
    password.addEventListener('input', function() {
        const value = this.value;
        let strength = 0;

        if (value.length >= 6) strength++;
        if (value.length >= 8) strength++;
        if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
        if (/\d/.test(value)) strength++;
        if (/[^a-zA-Z\d]/.test(value)) strength++;

        strengthBar.className = 'strength-bar-fill';
        
        if (strength <= 2) {
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Débil';
            strengthText.style.color = '#ff4757';
        } else if (strength <= 3) {
            strengthBar.classList.add('strength-medium');
            strengthText.textContent = 'Media';
            strengthText.style.color = '#ffa502';
        } else {
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Fuerte';
            strengthText.style.color = '#26de81';
        }
    });
}

// Función para validar el formulario
function validarFormulario(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    let isValid = true;

    // Validar nombre completo
    if (fullname.value.trim().length < 3) {
        mostrarError('fullnameError');
        isValid = false;
    } else {
        ocultarError('fullnameError');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        mostrarError('emailError');
        isValid = false;
    } else {
        ocultarError('emailError');
    }

    // Validar usuario
    const usernameError = document.getElementById('usernameError');
    if (username.value.trim().length < 4) {
        usernameError.textContent = 'El usuario debe tener al menos 4 caracteres';
        mostrarError('usernameError');
        isValid = false;
    } else if (usuarioExiste(username.value)) {
        usernameError.textContent = 'Este usuario ya existe';
        mostrarError('usernameError');
        isValid = false;
    } else {
        ocultarError('usernameError');
    }

    // Validar contraseña
    if (password.value.length < 6) {
        mostrarError('passwordError');
        isValid = false;
    } else {
        ocultarError('passwordError');
    }

    // Validar confirmación de contraseña
    if (password.value !== confirmPassword.value) {
        mostrarError('confirmPasswordError');
        isValid = false;
    } else {
        ocultarError('confirmPasswordError');
    }

    // Si todo es válido, registrar usuario
    if (isValid) {
        registrarUsuario(fullname.value, email.value, username.value, password.value);
    }
}

// Función para mostrar error
function mostrarError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('show');
    }
}

// Función para ocultar error
function ocultarError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Función para registrar usuario
function registrarUsuario(fullname, email, username, password) {
    const nuevoUsuario = {
        id: Date.now(),
        fullname: fullname,
        email: email,
        username: username,
        password: password,
        createdAt: new Date().toLocaleString('es-CO')
    };

    guardarUsuario(nuevoUsuario);
    
    // Mostrar mensaje de éxito
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
    }
    
    // Limpiar formulario
    const form = document.getElementById('registerForm');
    if (form) {
        form.reset();
    }
    
    // Limpiar indicador de fortaleza
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    if (strengthBar) strengthBar.className = 'strength-bar-fill';
    if (strengthText) strengthText.textContent = '';

    // Mostrar lista de usuarios
    mostrarUsuarios();

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        if (successMessage) {
            successMessage.classList.remove('show');
        }
    }, 3000);

    console.log('Usuario registrado:', nuevoUsuario);
}

// Función para mostrar lista de usuarios
function mostrarUsuarios() {
    const usersList = document.getElementById('usersList');
    const usersContainer = document.getElementById('usersContainer');
    
    if (!usersList || !usersContainer) return;
    
    const usuarios = obtenerUsuarios();
    
    if (usuarios.length > 0) {
        usersList.style.display = 'block';
        usersContainer.innerHTML = usuarios.map(user => `
            <div class="user-item">
                <strong>${user.username}</strong> - ${user.email} (${user.fullname})
            </div>
        `).join('');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar toggle de contraseñas
    togglePasswordVisibility('password', 'togglePassword');
    togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
    
    // Configurar verificación de fortaleza
    verificarFortaleza();
    
    // Configurar formulario
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', validarFormulario);
    }
    
    // Mostrar usuarios existentes al cargar la página
    mostrarUsuarios();
});