import React, { useState } from 'react';
import { useHRMS } from '../../../context/HRMSContext.jsx';
import { useNotifications } from '../../../context/NotificationContext.jsx';
import { Plus, Trash2, Award, Sparkles, Heart, Compass, BookOpen } from 'lucide-react';

export const ResumeTab = ({ employee, isEditing, onChange }) => {
  const { addSkill, removeSkill, addCertification, removeCertification } = useHRMS();
  const { showToast } = useNotifications();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Advanced');

  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('2024');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill(employee.id, {
      name: newSkillName.trim(),
      level: newSkillLevel,
    });
    setNewSkillName('');
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertIssuer.trim()) {
      showToast('error', 'Validation', 'Please provide Certificate Name and Issuer.');
      return;
    }
    addCertification(employee.id, {
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      issueYear: newCertYear,
    });
    setNewCertName('');
    setNewCertIssuer('');
  };

  return (
    <div className="space-y-6">
      {/* 1. About */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-black text-slate-900 tracking-tight">About Me</h4>
        </div>
        {isEditing ? (
          <textarea
            rows={3}
            value={employee.about || ''}
            onChange={(e) => onChange('about', e.target.value)}
            placeholder="Write a brief professional summary..."
            className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
          />
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {employee.about || 'No summary provided yet.'}
          </p>
        )}
      </div>

      {/* 2. Free text: What I love about my job & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What I love about my job */}
        <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">What I Love About My Job</h4>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={employee.whatILoveAboutMyJob || ''}
              onChange={(e) => onChange('whatILoveAboutMyJob', e.target.value)}
              placeholder="What motivates you every workday..."
              className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {employee.whatILoveAboutMyJob || 'Not specified.'}
            </p>
          )}
        </div>

        {/* Interests and hobbies */}
        <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">My Interests & Hobbies</h4>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={employee.interestsAndHobbies || ''}
              onChange={(e) => onChange('interestsAndHobbies', e.target.value)}
              placeholder="Hobbies, reading, travel, music..."
              className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {employee.interestsAndHobbies || 'Not specified.'}
            </p>
          )}
        </div>
      </div>

      {/* 3. Skills (Employee managed) */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Skills & Competencies</h4>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 font-mono">
            {employee.skills?.length || 0} skills listed
          </span>
        </div>

        {/* Skill badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(!employee.skills || employee.skills.length === 0) && (
            <p className="text-xs text-slate-400 italic">No skills added yet.</p>
          )}
          {employee.skills?.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-slate-800 border border-slate-200/80 shadow-2xs backdrop-blur-xs"
            >
              <span>{skill.name}</span>
              {skill.level && (
                <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200/60">
                  {skill.level}
                </span>
              )}
              {isEditing && (
                <button
                  onClick={() => removeSkill(employee.id, skill.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Add skill inline form */}
        {isEditing && (
          <form onSubmit={handleAddSkill} className="flex gap-2 pt-3 border-t border-slate-100/80">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add new skill (e.g. Next.js, Financial Modeling)"
              className="flex-1 px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 btn-accent text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        )}
      </div>

      {/* 4. Certifications (Employee managed) */}
      <div className="glass-panel rounded-3xl p-6 shadow-subtle border border-white/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Certifications & Credentials</h4>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 font-mono">
            {employee.certifications?.length || 0} credentials
          </span>
        </div>

        <div className="space-y-2.5 mb-4">
          {(!employee.certifications || employee.certifications.length === 0) && (
            <p className="text-xs text-slate-400 italic">No certifications listed yet.</p>
          )}
          {employee.certifications?.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-700 border border-teal-500/20">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{cert.name}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {cert.issuer} &bull; Issued {cert.issueYear}
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => removeCertification(employee.id, cert.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add certification form */}
        {isEditing && (
          <form onSubmit={handleAddCert} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100/80">
            <input
              type="text"
              placeholder="Certification Title"
              value={newCertName}
              onChange={(e) => setNewCertName(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Issuer (e.g. AWS, SHRM)"
              value={newCertIssuer}
              onChange={(e) => setNewCertIssuer(e.target.value)}
              className="px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 btn-accent text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Credential
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
