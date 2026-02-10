import { loginSchema, registerSchema, addressSchema } from "../auth";

describe("loginSchema", () => {
  it("should validate correct login data", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("E-mail inválido");
    }
  });

  it("should reject empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "A senha deve ter pelo menos 6 caracteres"
      );
    }
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validData = {
    firstName: "Maria",
    lastName: "Silva",
    email: "maria@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  it("should validate correct register data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject short firstName", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "M",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nome deve ter pelo menos 2 caracteres"
      );
    }
  });

  it("should reject short lastName", () => {
    const result = registerSchema.safeParse({
      ...validData,
      lastName: "S",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Sobrenome deve ter pelo menos 2 caracteres"
      );
    }
  });

  it("should reject mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "654321",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (i) => i.path.includes("confirmPassword")
      );
      expect(confirmError?.message).toBe("As senhas não coincidem");
    }
  });

  it("should reject invalid email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "not-email",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "123",
      confirmPassword: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("addressSchema", () => {
  const validAddress = {
    recipientName: "Maria Silva",
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
  };

  it("should validate correct address", () => {
    const result = addressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("should accept optional label", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      label: "Casa",
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional complement", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      complement: "Apto 42",
    });
    expect(result.success).toBe(true);
  });

  it("should accept CEP without hyphen", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      zipCode: "01234567",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid CEP format", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      zipCode: "1234",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("CEP inválido");
    }
  });

  it("should reject CEP with letters", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      zipCode: "abcde-fgh",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid state (must be 2 chars)", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      state: "São Paulo",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("UF inválida");
    }
  });

  it("should reject empty recipientName", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      recipientName: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty number", () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      number: "",
    });
    expect(result.success).toBe(false);
  });
});
