import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHRMS } from '../../context/HRMSContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { generateSystemLoginId } from '../../utils/idGenerator.js';
import { CredentialsDeliveryModal } from './CredentialsDeliveryModal.jsx';
import {
  Lock,
  User,
  Building,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LoginForm = () => {
  const { login, registerNewUserAccount } = useAuth();
  const { employees, addEmployee } = useHRMS();
  const { showToast } = useNotifications();

  // Mode: false = Sign In, true = Sign Up (per Wireframe)
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign In Form States
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoPersonas, setShowDemoPersonas] = useState(false);

  // Sign Up Form States (per Wireframe fields)
  const [companyName, setCompanyName] = useState('Odoo India');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyLogoName, setCompanyLogoName] = useState(null);
  const [newCredentials, setNewCredentials] = useState(null);

  // Live Login ID preview per Wireframe rule: [OI][First2First][First2Last][Year][Serial]
  const previewLoginId = fullName.trim()
    ? generateSystemLoginId(fullName, companyName, new Date().getFullYear(), employees)
    : 'OIJODO20260001';

  // Handle Sign In submission
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = login(loginIdOrEmail, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  // Quick 1-click test persona login
  const handleQuickLogin = (idOrEmail, pass = 'password123') => {
    setLoginIdOrEmail(idOrEmail);
    setPassword(pass);
    setErrorMessage('');
    login(idOrEmail, pass);
  };

  // Handle Sign Up submission (per Wireframe)
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    // 1. Generate system login ID strictly adhering to wireframe format
    const generatedLoginId = generateSystemLoginId(
      fullName,
      companyName,
      new Date().getFullYear(),
      employees
    );

    // 2. Add employee into HRMS
    const newEmpId = `emp-${Date.now()}`;
    const newEmployeeRecord = {
      name: fullName,
      email: email.trim().toLowerCase(),
      mobile: phone || '+91 98765 43210',
      company: companyName || 'Odoo India',
      department: 'Engineering',
      jobPosition: 'Associate Member',
      monthlyWage: 65000,
      gender: 'Male',
      dateOfJoining: new Date().toISOString().split('T')[0],
      location: 'Bangalore Tech Hub',
    };

    try {
      addEmployee(newEmployeeRecord);

      // Register direct user account
      registerNewUserAccount({
        id: `user-${newEmpId}`,
        loginId: generatedLoginId,
        email: email.trim().toLowerCase(),
        role: 'EMPLOYEE',
        employeeId: newEmpId,
        isFirstLogin: false,
      });

      const creds = {
        loginId: generatedLoginId,
        initialPassword: signUpPassword,
        name: fullName,
        email: email.trim().toLowerCase(),
      };

      setNewCredentials(creds);
      showToast('success', 'Registration Successful 🎉', `Your Login ID is ${generatedLoginId}`);
      setIsSubmitting(false);
    } catch (err) {
      setErrorMessage('Sign up failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLogoUploadSim = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setCompanyLogoName(e.target.files[0].name);
        showToast('info', 'Company Logo Selected', e.target.files[0].name);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen aurora-login-bg flex items-center justify-center p-5 sm:p-8 lg:p-12 relative overflow-hidden font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
        
        {/* LEFT COLUMN: Hero Headline & Value Proposition (Matching Image 1 Reference) */}
        <div className="lg:col-span-6 xl:col-span-7 text-left space-y-4 sm:space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
            Manage your <br className="hidden sm:inline" />
            workforce <br className="hidden sm:inline" />
            with ease
          </h1>
          <p className="text-base sm:text-lg text-white/85 font-medium max-w-lg leading-relaxed drop-shadow-xs">
            Streamline HR processes with our secure, role-gated architecture.
          </p>

          {/* Feature highlights */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-semibold text-white/90">
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Real-Time Attendance Derivation</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              <span>50/50 Salary CTC Engine</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Auto Wireframe ID Generation</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Frosted Glass Form Card (Matching Image 1 & Wireframe) */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
          <div className="glass-login-card rounded-[32px] w-full max-w-[430px] p-7 sm:p-9 shadow-2xl relative transition-all animate-fade-in">
            
            {/* Logo & Brand Header */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-6h2v6zm0-8h-2V7h2v2z" opacity="0.3"/>
                  <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              </div>

              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Dayflow
              </span>

              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/60 text-slate-800 border border-white/70 shadow-2xs">
                HRMS
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-400/40 text-rose-950 text-xs flex items-start gap-2 animate-fade-in shadow-2xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW A: SIGN IN FORM (Matching Image 1 & Wireframe) */}
            {/* ======================================================== */}
            {!isSignUp ? (
              <form className="space-y-4" onSubmit={handleSignInSubmit}>
                {/* Login ID or Email Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={loginIdOrEmail}
                    onChange={(e) => setLoginIdOrEmail(e.target.value)}
                    placeholder="Login ID or Email"
                    className="w-full glass-login-input rounded-xl px-4 py-3 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Password Input with show/hide eye toggle */}
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full glass-login-input rounded-xl pl-4 pr-10 py-3 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Sign In Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0B1528] hover:bg-[#15233D] text-white py-3.5 px-4 rounded-xl text-xs font-bold shadow-lg shadow-slate-950/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Sign In to Dayflow</span>
                    <span className="text-base leading-none">&rarr;</span>
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => alert('Demo Credentials: Use "admin@dayflow.internal" with password "admin123" for Admin, or "OITODO0220001" with password "password123" for Employee.')}
                    className="text-xs font-semibold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Wireframe Toggle: Don't have an Account? Sign Up */}
                <div className="pt-2 text-center border-t border-white/30">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setIsSignUp(true);
                    }}
                    className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
                  >
                    Don't have an Account? <span className="text-teal-900 font-extrabold">Sign Up</span>
                  </button>
                </div>

                {/* 1-Click Quick Demo Login Accordion */}
                <div className="pt-2 border-t border-white/20">
                  <button
                    type="button"
                    onClick={() => setShowDemoPersonas(!showDemoPersonas)}
                    className="w-full flex items-center justify-between text-[11px] font-bold text-slate-800 hover:text-slate-950 py-1 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-teal-800" />
                      <span>1-Click Demo Personas</span>
                    </span>
                    {showDemoPersonas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showDemoPersonas && (
                    <div className="grid grid-cols-2 gap-2 mt-2 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('admin@dayflow.internal', 'admin123')}
                        className="p-2 rounded-xl border border-white/60 bg-white/50 hover:bg-white/80 text-left transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="text-[9px] font-bold text-purple-900 uppercase">Admin / HR 👑</div>
                        <div className="text-xs font-bold text-slate-900">Sarah Williams</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickLogin('OITODO0220001', 'password123')}
                        className="p-2 rounded-xl border border-white/60 bg-white/50 hover:bg-white/80 text-left transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="text-[9px] font-bold text-teal-900 uppercase">Employee 🟢</div>
                        <div className="text-xs font-bold text-slate-900">Alex Johnson</div>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            ) : (
              /* ======================================================== */
              /* VIEW B: SIGN UP FORM (Matching Wireframe Page 2) */
              /* ======================================================== */
              <form className="space-y-3 animate-fade-in" onSubmit={handleSignUpSubmit}>
                {/* Header Title */}
                <div className="text-center mb-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Create Employee / Company Account
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium">
                    ID will be auto-generated per Wireframe Rule
                  </p>
                </div>

                {/* Company Name + Upload Logo */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Company Name :-
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Odoo India"
                      className="flex-1 glass-login-input rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleLogoUploadSim}
                      className="px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                      title="Upload Logo"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-800" />
                      <span className="hidden sm:inline text-[11px]">{companyLogoName ? 'Uploaded' : 'Logo'}</span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Name :-
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full glass-login-input rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Email :-
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@company.internal"
                    className="w-full glass-login-input rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Phone :-
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full glass-login-input rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Password with eye toggle */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Password :-
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full glass-login-input rounded-xl pl-3.5 pr-9 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with eye toggle */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Confirm Password :-
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full glass-login-input rounded-xl pl-3.5 pr-9 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-600/80 focus:outline-none shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Wireframe Rule Preview Badge */}
                <div className="p-2 rounded-xl bg-white/40 border border-white/50 text-[11px] text-slate-800 flex items-center justify-between">
                  <span className="font-medium">Derived Login ID:</span>
                  <span className="font-mono font-bold text-teal-900 bg-white/60 px-2 py-0.5 rounded shadow-2xs">
                    {previewLoginId}
                  </span>
                </div>

                {/* Sign Up Button (Purple/Midnight per Wireframe) */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0B1528] hover:bg-[#15233D] text-white py-3 px-4 rounded-xl text-xs font-bold shadow-lg shadow-slate-950/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4 text-teal-400" />
                  </button>
                </div>

                {/* Wireframe Link: Already have an account ? Sign In */}
                <div className="text-center pt-2 border-t border-white/30">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setIsSignUp(false);
                    }}
                    className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
                  >
                    Already have an account ? <span className="text-teal-900 font-extrabold">Sign In</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Credentials Delivery Modal (Shows generated Wireframe ID and allows 1-click login) */}
      <CredentialsDeliveryModal
        isOpen={!!newCredentials}
        onClose={() => {
          if (newCredentials) {
            handleQuickLogin(newCredentials.loginId, newCredentials.initialPassword);
          }
          setNewCredentials(null);
        }}
        credentials={newCredentials}
      />
    </div>
  );
};
