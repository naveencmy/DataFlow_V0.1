import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../stores/authStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { LoginSchema, SignUpSchema } from '../../validation/auth.schema.js';
import { generateSystemLoginId } from '../../utils/idGenerator.js';
import {
  Lock,
  User,
  Building,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Upload,
  UserPlus,
  LogIn,
  Server,
} from 'lucide-react';
import { ServerConfigModal } from '../common/ServerConfigModal.jsx';


export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const addToast = useUIStore((state) => state.addToast);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDemoPersonas, setShowDemoPersonas] = useState(false);
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverError, setServerError] = useState('');
  const [uploadedLogoName, setUploadedLogoName] = useState(null);

  // Sign In Form (React Hook Form + Zod)
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
    setValue: setLoginValue,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      loginId: '',
      password: '',
    },
  });

  // Sign Up Form (React Hook Form + Zod)
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors, isSubmitting: isSigningUp },
    watch: watchSignUp,
    reset: resetSignUp,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      companyName: 'Odoo India',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN',
      department: 'Management',
      jobPosition: 'HR Administrator',
    },
  });

  // Live Login ID preview per Wireframe rule: [OI][First2First][First2Last][Year][Serial]
  const watchedName = watchSignUp('name') || '';
  const watchedCompany = watchSignUp('companyName') || 'Odoo India';

  const previewLoginId = useMemo(() => {
    if (!watchedName.trim()) return 'OIJODO20260001';
    return generateSystemLoginId(watchedName, watchedCompany, new Date().getFullYear(), []);
  }, [watchedName, watchedCompany]);

  // Handle Login Submit
  const onLogin = async (data) => {
    setServerError('');
    try {
      await login(data);
      addToast({
        title: 'Welcome Back',
        message: 'Signed in successfully to Dayflow HRMS.',
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid credentials.');
    }
  };

  // Handle Sign Up Submit
  const onSignUp = async (data) => {
    setServerError('');
    try {
      await signup(data);
      addToast({
        title: 'Account Created',
        message: `Registered successfully! Generated Login ID: ${previewLoginId}`,
        type: 'success',
      });
      resetSignUp();
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed.');
    }
  };

  // Quick Demo Persona Filler (Dev mode only)
  const applyPersona = (loginId, password) => {
    setIsSignUp(false);
    setLoginValue('loginId', loginId);
    setLoginValue('password', password);
    setServerError('');
  };

  return (
    <div className="min-h-screen aurora-login-bg flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans select-none">
      {/* Top Bar with Server Connection Config */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={() => setShowServerModal(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Server className="w-3.5 h-3.5 text-teal-600" />
          <span>Server Settings</span>
        </button>
      </div>

      {/* Background Radial Glow Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-400/30 blur-[130px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full bg-indigo-600/35 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-teal-300/25 blur-[110px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* LEFT COLUMN: Hero Pitch (Matching Image 2 Reference) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-white text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold tracking-wide shadow-sm uppercase">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            <span>Next-Gen Enterprise HRMS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] drop-shadow-sm font-sans">
            Simplify Workforce Operations.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-100 to-white">
              Streamline Every Day.
            </span>
          </h1>

          <p className="text-slate-100 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed text-balance opacity-95">
            Dayflow unifies employee records, real-time attendance, one-click time-off workflows, and automated 50/50 payroll structures into a single intuitive platform.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-white/90">
            <span className="px-4.5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2.5 shadow-sm hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-300 shrink-0" />
              <span>Unified Employee Records</span>
            </span>
            <span className="px-4.5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2.5 shadow-sm hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-300 shrink-0" />
              <span>Real-Time Attendance Derivation</span>
            </span>
            <span className="px-4.5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-2.5 shadow-sm hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-300 shrink-0" />
              <span>Automated 50/50 Payroll</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Frosted Glass Form Card (Matching Wireframe Image 1 + UI Image 2) */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
          <div className="glass-login-card rounded-[32px] w-full max-w-[450px] p-7 sm:p-9 shadow-2xl relative transition-all animate-fade-in">
            {/* Logo & Brand Header */}
            <div className="flex items-center justify-center mb-6">
              <img
                src={logo}
                alt="DayFlow HRMS"
                title="Dayflow HRMS"
                className="w-full max-w-[280px] h-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Error Message */}
            {serverError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-400/40 text-rose-950 text-xs flex items-start gap-2 animate-fade-in shadow-2xs font-medium"
              >
                <AlertCircle className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{serverError}</div>
              </div>
            )}

            {/* VIEW 1: SIGN IN PAGE (Wireframe Match) */}
            {!isSignUp ? (
              <div className="space-y-5 animate-fade-in">
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4" noValidate>
                  {/* Login ID / Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 tracking-wide">
                      Login Id/Email :-
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...registerLogin('loginId')}
                        placeholder="e.g. admin@dayflow.internal or OIALJO20220001"
                        aria-label="Login ID or Email"
                        className="glass-login-input w-full px-4 py-3 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      />
                    </div>
                    {loginErrors.loginId && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        {loginErrors.loginId.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 tracking-wide">
                      Password :-
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...registerLogin('password')}
                        placeholder="••••••••"
                        aria-label="Password"
                        className="glass-login-input w-full pl-4 pr-10 py-3 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  {/* SIGN IN Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg shadow-slate-900/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-70 mt-3"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SIGN IN</span>
                        <ArrowRight className="w-4 h-4 text-teal-300" />
                      </>
                    )}
                  </button>
                </form>

                {/* Wireframe Switch Link: Don't have an Account? Sign Up */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setServerError('');
                    }}
                    className="text-xs text-slate-700 font-semibold hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Don't have an Account? <span className="text-teal-700 font-bold underline decoration-teal-500/50 underline-offset-4 hover:text-teal-900">Sign Up</span>
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW 2: SIGN UP PAGE (Wireframe Match) */
              <div className="space-y-4 animate-fade-in">
                <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-3" noValidate>
                  {/* Company Name + Upload Logo Button */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Company Name :-
                      </label>
                      <label className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-white/60 hover:bg-white px-2.5 py-1 rounded-lg border border-white/70 shadow-2xs cursor-pointer transition-all">
                        <Upload className="w-3 h-3 text-teal-600" />
                        <span>{uploadedLogoName ? 'Logo Uploaded' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setUploadedLogoName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      {...registerSignUp('companyName')}
                      placeholder="e.g. Odoo India"
                      className="glass-login-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    {signUpErrors.companyName && (
                      <p className="text-xs text-rose-600 font-semibold">{signUpErrors.companyName.message}</p>
                    )}
                  </div>

                  {/* Name :- */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Name :-
                    </label>
                    <input
                      type="text"
                      {...registerSignUp('name')}
                      placeholder="e.g. John Doe"
                      className="glass-login-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    {signUpErrors.name && (
                      <p className="text-xs text-rose-600 font-semibold">{signUpErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email :- */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Email :-
                    </label>
                    <input
                      type="email"
                      {...registerSignUp('email')}
                      placeholder="john.doe@odoo.com"
                      className="glass-login-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    {signUpErrors.email && (
                      <p className="text-xs text-rose-600 font-semibold">{signUpErrors.email.message}</p>
                    )}
                  </div>

                  {/* Phone :- */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Phone :-
                    </label>
                    <input
                      type="text"
                      {...registerSignUp('phone')}
                      placeholder="+91 98765 43210"
                      className="glass-login-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  {/* Password :- */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Password :-
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...registerSignUp('password')}
                        placeholder="••••••••"
                        className="glass-login-input w-full pl-3.5 pr-9 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {signUpErrors.password && (
                      <p className="text-xs text-rose-600 font-semibold">{signUpErrors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password :- */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Confirm Password :-
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerSignUp('confirmPassword')}
                        placeholder="••••••••"
                        className="glass-login-input w-full pl-3.5 pr-9 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {signUpErrors.confirmPassword && (
                      <p className="text-xs text-rose-600 font-semibold">{signUpErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Live System Generated Login ID Indicator */}
                  <div className="p-2.5 rounded-xl bg-teal-900/10 border border-teal-800/20 text-[11px] text-slate-800 flex items-center justify-between backdrop-blur-sm">
                    <span className="font-semibold text-slate-700">Auto-Generated System ID:</span>
                    <span className="font-mono font-bold text-teal-900 bg-white/70 px-2 py-0.5 rounded-md shadow-2xs">
                      {previewLoginId}
                    </span>
                  </div>

                  {/* Sign Up Button (Purple gradient matching wireframe) */}
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 mt-2"
                  >
                    {isSigningUp ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>
                </form>

                {/* Wireframe Switch Link: Already have an account ? Sign In */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setServerError('');
                    }}
                    className="text-xs text-slate-700 font-semibold hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Already have an account ? <span className="text-teal-700 font-bold underline decoration-teal-500/50 underline-offset-4 hover:text-teal-900">Sign In</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Personas Dropdown (Dev mode) */}
            {import.meta.env.DEV && (
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowDemoPersonas(!showDemoPersonas)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>1-Click Demo Credentials</span>
                  </span>
                  {showDemoPersonas ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showDemoPersonas && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => applyPersona('admin@dayflow.internal', 'admin123')}
                      className="w-full p-2.5 rounded-xl bg-white/70 hover:bg-white border border-teal-200/80 text-left transition-colors cursor-pointer shadow-2xs"
                    >
                      <div className="text-xs font-bold text-teal-950 flex items-center justify-between">
                        <span>👑 HR Administrator (Sarah Williams)</span>
                        <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">admin123</span>
                      </div>
                      <div className="text-[11px] text-teal-800/80 font-mono mt-0.5">admin@dayflow.internal</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPersona('OIALJO20220001', 'employee123')}
                      className="w-full p-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200 text-left transition-colors cursor-pointer shadow-2xs"
                    >
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>👤 Alex Johnson (Employee)</span>
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">employee123</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">OIALJO20220001</div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Server Connection Modal */}
      <ServerConfigModal
        isOpen={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </div>
  );
};

export default LoginForm;

