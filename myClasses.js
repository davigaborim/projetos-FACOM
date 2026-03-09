const DEFAULT_MESSAGE = "OK";

class Login {
    constructor(loginEmail, loginPassword) {
        this.email = loginEmail;
        this.password = loginPassword;
        this.status = DEFAULT_MESSAGE;
    }

    setError(message) {
        if (this.status === DEFAULT_MESSAGE) {
            this.status = message;
        }
    }

    validateEmail() {
        const TestEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!TestEmail.test(this.email)) {
            this.setError("Formato de email inválido");
        }
    }

    validatePassword() {
        const TestPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,100}$/;
        if (this.password === "") {
            this.setError("O campo de senha não foi preenchido");
        } else if (!TestPassword.test(this.password)) {
            this.setError("Formato de senha inválido");
        }
    }

    validateData() {
        this.status = DEFAULT_MESSAGE;

        this.validateEmail();
        if (this.status !== DEFAULT_MESSAGE) return;

        this.validatePassword();
    }
}

class User extends Login {
    constructor(name, email, password, passwordRepeat) {
        super(email, password);
        this.name = name;
        this.passwordRepeat = passwordRepeat;
    }

    validateName() {
        const TestName = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

        if (!this.name) {
            this.setError("O nome não pode ser vazio!");
        } else if (!TestName.test(this.name)) {
            this.setError("O nome deve conter apenas letras e espaços!");
        }
    }

    validatePassword() {
        super.validatePassword();

        if (this.status !== DEFAULT_MESSAGE) return;

        if (this.password !== this.passwordRepeat) {
            this.setError("As senhas não são iguais!");
        }
    }

    validateData() {
        this.status = DEFAULT_MESSAGE;

        this.validateName();
        if (this.status !== DEFAULT_MESSAGE) return;

        this.validateEmail();
        if (this.status !== DEFAULT_MESSAGE) return;

        this.validatePassword();
    }
}

class UserManager extends User {
    constructor(name, email, password, passwordRepeat) {
        super(name, email, password, passwordRepeat);
        this.role = "admin";
    }
}

module.exports = { Login, User, UserManager, DEFAULT_MESSAGE };