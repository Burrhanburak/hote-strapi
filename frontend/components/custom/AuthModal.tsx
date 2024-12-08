import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUserAction, registerUserAction } from "@/lib/action/auth-actions";

const AuthModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (userData: any) => void;
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    identifier: "",
  });
  const [error, setError] = useState("");
  const router = useRouter(); // Move useRouter here

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) =>
      form.append(key, formData[key as keyof typeof formData])
    );

    let response;
    if (isRegister) {
      response = await registerUserAction({}, form);
    } else {
      response = await loginUserAction({}, form);
    }

    if (response.redirect) {
      router.push(response.redirect);
    } else {
      setError(response);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </>
          )}
          {!isRegister && (
            <input
              type="text"
              placeholder="Identifier (Username or Email)"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              required={!isRegister}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
          <p>{error}</p>
        </form>
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
