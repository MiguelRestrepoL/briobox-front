import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user.api';

export default function RegisterClientPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    paternal_last_name: '',
    maternal_last_name: '',
    age: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.first_name.trim()) newErrors.first_name = 'El primer nombre es requerido.';
    if (!form.middle_name.trim()) newErrors.middle_name = 'El segundo nombre es requerido.';
    if (!form.paternal_last_name.trim()) newErrors.paternal_last_name = 'El apellido paterno es requerido.';
    if (!form.maternal_last_name.trim()) newErrors.maternal_last_name = 'El apellido materno es requerido.';
    if (!form.age || Number(form.age) < 13) newErrors.age = 'Edad mínima 13 años.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email inválido.';
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) newErrors.phone = 'Teléfono debe tener 10 dígitos.';
    if (!form.address.trim()) newErrors.address = 'La dirección es requerida.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await userApi.createClient({
        first_name: form.first_name,
        middle_name: form.middle_name,
        paternal_last_name: form.paternal_last_name,
        maternal_last_name: form.maternal_last_name,
        age: Number(form.age),
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      setSuccess(true);
      setTimeout(() => navigate('/clients'), 2500);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Error al registrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0000_0%,_#050000_35%,_#000000_65%)]" />
      <div className="absolute w-[700px] h-[400px] rounded-full blur-[160px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-950/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.7)_70%,_rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-black/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-black/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-black/80 to-transparent pointer-events-none" />

      <div className="relative z-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg shadow-2xl flex flex-col items-center gap-6">

        {success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full border border-red-900/40 flex items-center justify-center drop-shadow-[0_0_15px_rgba(180,0,0,0.3)]">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">¡Cliente registrado!</h1>
            <p className="text-white/30 text-xs text-center tracking-wider">Redirigiendo a clientes...</p>
            <div className="flex gap-1.5 items-center">
              <div className="w-1 h-1 rounded-full bg-red-500/80 animate-pulse" />
              <div className="w-8 h-px bg-red-500/40" />
              <div className="w-1 h-1 rounded-full bg-red-500/80 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <img src="/brioboxlogo.png" alt="BrioBox" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(180,0,0,0.4)]" />
              <h1 className="text-white text-2xl font-bold tracking-wide">Nuevo Cliente</h1>
              <p className="text-white/30 text-xs text-center tracking-wider uppercase">Completa los datos del cliente</p>
            </div>

            <div className="w-full h-px bg-red-900/30" />

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

              {/* Nombres en grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Primer nombre</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Juan"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.first_name && <span className="text-red-500 text-[10px]">{errors.first_name}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Segundo nombre</label>
                  <input name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="Carlos"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.middle_name && <span className="text-red-500 text-[10px]">{errors.middle_name}</span>}
                </div>
              </div>

              {/* Apellidos en grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Apellido paterno</label>
                  <input name="paternal_last_name" value={form.paternal_last_name} onChange={handleChange} placeholder="Pérez"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.paternal_last_name && <span className="text-red-500 text-[10px]">{errors.paternal_last_name}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Apellido materno</label>
                  <input name="maternal_last_name" value={form.maternal_last_name} onChange={handleChange} placeholder="García"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.maternal_last_name && <span className="text-red-500 text-[10px]">{errors.maternal_last_name}</span>}
                </div>
              </div>

              {/* Edad y teléfono */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Edad</label>
                  <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="25"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.age && <span className="text-red-500 text-[10px]">{errors.age}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">Teléfono</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="3001234567"
                    className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                  {errors.phone && <span className="text-red-500 text-[10px]">{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="cliente@email.com"
                  className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                {errors.email && <span className="text-red-500 text-[10px]">{errors.email}</span>}
              </div>

              {/* Dirección */}
              <div className="flex flex-col gap-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Dirección</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Calle 123 #45-67, Bogotá"
                  className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-900/60 transition-colors" />
                {errors.address && <span className="text-red-500 text-[10px]">{errors.address}</span>}
              </div>

              {apiError && (
                <p className="text-red-500 text-xs text-center bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">{apiError}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#cc0000] hover:bg-red-700 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1 tracking-widest text-sm uppercase shadow-lg shadow-red-950/30">
                {loading ? 'Registrando...' : 'Registrar Cliente →'}
              </button>
            </form>

            <button onClick={() => navigate('/clients')} className="text-white/25 text-xs hover:text-white/50 transition-colors tracking-wider">
              ← Volver a clientes
            </button>
          </>
        )}
      </div>
    </div>
  );
}