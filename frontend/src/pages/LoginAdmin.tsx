import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
  // Estado para campos do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Função executada ao enviar o formulário
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    setErro(""); // Limpa erros anteriores

    try {
      // Envia requisição para o backend com os dados do admin
      const res = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({ email, senha }),
      });

      // Se a resposta for inválida, lança erro
      if (!res.ok) {
        const msg = await res.text();
        console.error("Erro na resposta do servidor:", msg); // 🔍 Log de erro detalhado
        throw new Error("Erro ao fazer login: " + res.status);
      }

      const data = await res.json(); // Lê o corpo da resposta
      console.log("Login bem-sucedido:", data); // 🔍 Log de sucesso

      localStorage.setItem("adminToken", data.token); // Salva o token
      navigate("/admin/dashboard"); // Redireciona para o dashboard
    } catch (err: any) {
      console.error("Erro no login:", err); // 🔍 Log completo
      setErro(err.message); // Exibe mensagem de erro na interface
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-white text-2xl mb-4 text-center">Login Admin</h2>

        {/* Mensagem de erro, se houver */}
        {erro && <p className="text-red-500 mb-2 text-sm text-center">{erro}</p>}

        {/* Campo de email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-zinc-800 text-white"
          required
        />

        {/* Campo de senha */}
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-zinc-800 text-white"
          required
        />

        {/* Botão de envio */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
