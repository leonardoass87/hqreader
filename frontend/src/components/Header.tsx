import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
      {/* ESQUERDA: Logo + Links */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-green-400">MReader</h1>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Mangás
          </a>
        </nav>
      </div>

      {/* DIREITA: Busca + Admin */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar mangá..."
          className="bg-zinc-800 text-white px-4 py-1 rounded outline-none"
        />
        {localStorage.getItem("adminName") && (
          <span className="text-sm text-green-400 font-semibold">
            {localStorage.getItem("adminName")}
          </span>
        )}
        <button
          onClick={() => {
            const token = localStorage.getItem("adminToken");
            navigate(token ? "/admin/dashboard" : "/admin/login");
          }}
          className="text-white hover:text-green-400 transition"
          title="Área Admin"
        >
          👤
        </button>
      </div>
    </header>
  );
};

export default Header;
