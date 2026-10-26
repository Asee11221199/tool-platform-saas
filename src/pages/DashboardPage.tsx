import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

type CardItem = {
  id: string;
  code: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<any>(null);
  const [count, setCount] = useState(20);
  const [prefix, setPrefix] = useState('USER');
  const [loading, setLoading] = useState(false);

  async function loadCards() {
    const res = await apiFetch('/cards/');
    setCards(res.cards || []);
  }

  async function loadDeviceStatus() {
    const res = await apiFetch('/device/status');
    setDeviceStatus(res);
  }

  async function bindCurrentDevice() {
    try {
      const fingerprint = await generateFingerprint();
      const userAgent = navigator.userAgent || 'Unknown';
      const platform = navigator.platform || 'Unknown';

      const res = await apiFetch('/device/bind', {
        method: 'POST',
        body: JSON.stringify({
          fingerprint,
          userAgent,
          platform
        })
      });

      alert(res.message);
      loadDeviceStatus();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function generateCards() {
    setLoading(true);

    try {
      const res = await apiFetch('/cards/generate-batch', {
        method: 'POST',
        body: JSON.stringify({
          count,
          prefix
        })
      });

      alert(`成功生成 ${res.createdCount} 张卡密`);
      await loadCards();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
    loadDeviceStatus();
  }, []);

  return (
    <div className="dashboard">
      <h2>工具后台</h2>

      <div className="panel">
        <h3>设备绑定（单机一码）</h3>

        {deviceStatus && deviceStatus.bindCount > 0 ? (
          <p>已绑定设备：{deviceStatus.bindCount}</p>
        ) : (
          <button onClick={bindCurrentDevice}>绑定当前设备</button>
        )}
      </div>

      <div className="panel">
        <h3>批量生成卡密</h3>

        <div className="row">
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="前缀"
          />

          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />

          <button onClick={generateCards} disabled={loading}>
            {loading ? '生成中...' : '生成'}
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>我的卡密</h3>

        <ul className="card-list">
          {cards.map((card) => (
            <li key={card.id}>
              <strong>{card.code}</strong> · {card.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function generateFingerprint(): Promise<string> {
  const source = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(source);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}