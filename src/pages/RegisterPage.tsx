import { useState } from 'react';
import { apiFetch } from '../api';

export default function RegisterPage({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          username,
          password
        })
      });

      localStorage.setItem('token', res.token);
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-box">
      <h2>注册</h2>

      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister} disabled={loading}>
        {loading ? '注册中...' : '注册'}
      </button>

      <p className="muted">
        已有账号？{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          去登录
        </button>
      </p>
    </div>
  );
}