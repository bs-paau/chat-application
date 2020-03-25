export class PasswordValidator {
    public static validatePassword(pass: string) : boolean {
        const lowerCaseReg = /[a-z]+/;
        const upperCaseReg = /[A-Z]+/;
        const numberReg = /[0-9]+/;

        const regMatch =  lowerCaseReg.test(pass) && upperCaseReg.test(pass) && numberReg.test(pass);
        const valid = regMatch && pass.length >= 8;
        return valid;
    }
}