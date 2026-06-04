import { useState } from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../components/SegmentedControl';
import Breadcrumb from '../components/Breadcrumb';
import {
  HelpCircle,
  BookOpen,
  Layers,
  Award,
  AlertTriangle,
  Flame,
  Shield,
  ShieldAlert,
  Terminal,
  Zap,
  Users,
  Search,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const tabOptions = [
    { value: 'story', label: 'Sage Pippalāda & Origins' },
    { value: 'symbolism', label: 'Logo Symbolism' },
    { value: 'features', label: 'Platform Features' },
    { value: 'economy', label: 'Reputation Economy' },
  ];

  return (
    <div className="page-container max-w-4xl">
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* Hero Header */}
      <div className="text-center mb-8 relative">
        <div className="blob-accent w-64 h-64 -top-10 left-1/2 -translate-x-1/2 opacity-10" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 animate-float">
            <img
              src="/PippaQ1.webp"
              alt="PippaQ Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            />
          </div>
          <h1 className="font-brand text-4xl font-extrabold tracking-tight">
            About <span className="text-gradient">PippaQ</span>
          </h1>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">
            The fusion of ancient sage wisdom, structured verification, and modern AI intelligence.
          </p>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex justify-center mb-8">
        <SegmentedControl
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          className="w-full max-w-2xl"
        />
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'story' && (
          <div className="card shadow-premium p-6 sm:p-8 space-y-6 bg-white/80 backdrop-blur-sm animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">🧠 PippaQ — The Wisdom of Sage Pippalāda</h2>
            </div>
            
            <p className="text-sm text-primary leading-relaxed">
              <strong>PippaQ</strong> is inspired by the ancient <strong>Sage Pippalāda</strong>, a legendary philosopher and scholar in Indian history. He is a symbol of deep wisdom, clarity, and the ultimate ability to answer profound questions about existence, knowledge, and truth.
            </p>

            <blockquote className="border-l-4 border-accent pl-4 py-1.5 bg-accent-50/20 rounded-r-lg italic text-sm text-slate-700">
              "Just like Sage Pippalāda guided seekers with precise answers to complex questions, PippaQ is a modern AI-powered FAQ and Query Resolution system designed to structure, validate, and sustain community knowledge."
            </blockquote>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Answer Intelligently</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Leverages state-of-the-art semantic searches to resolve user queries with pre-approved knowledge.
                </p>
              </div>
              
              <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Validate Logic</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Applies structured, hierarchical validation flows from peers, moderators, and admins.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Search className="w-3.5 h-3.5" />
                  <span>Filter Duplicates</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Uses RAG decision systems to keep the database tidy and penalize redundant submissions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Evolving Knowledge</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Promotes highly upvoted real-time queries into permanent structured FAQ articles.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center border-t border-border/40 text-xs font-bold text-slate-500">
              👉 PippaQ represents the perfect fusion of ancient wisdom and modern AI-driven FAQ systems.
            </div>
          </div>
        )}

        {activeTab === 'symbolism' && (
          <div className="card shadow-premium p-6 sm:p-8 bg-white/80 backdrop-blur-sm animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">🎨 Logo Meaning & Symbolism</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left Side: Logo Display */}
              <div className="w-48 h-48 flex-shrink-0 bg-slate-50 rounded-2xl border border-border/40 p-6 flex items-center justify-center relative shadow-inner">
                <img
                  src="/PippaQ1.webp"
                  alt="PippaQ Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,0,0,0.06)]"
                />
              </div>

              {/* Right Side: Symbolism Breakdown */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="text-amber-500">🔥</span> Fire / Flame (Tapasya - Knowledge Discipline)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    Represents continuous learning, refinement, and inner discipline. It symbolizes <em>Tapasya</em>—the effort required to gain and sustain knowledge, mirroring the AI engine's continuous answer refinement.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="text-emerald-500">🌿</span> Jata (Flow of Knowledge Base)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    Represents structured knowledge growth and an expanding network. It illustrates how information flows, connects, and strengthens over time as the community contributes answers.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="text-blue-500">💎</span> Diamonds & Circular Boundary (Control & Stability)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    The circular boundary represents controlled knowledge validation. Diamonds signify stability and checkpoint verifications, ensuring that even as knowledge expands outward, it remains governed and stable.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="text-indigo-500">🔷</span> Q Formation (Modern Identity)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    The overall visual layout forms the letter <strong>“Q”</strong>, representing our query-centric architecture, question-based intelligence, and modern AI-driven knowledge engine.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40 text-center text-xs font-bold text-slate-500">
              👉 The logo is a perfect blend of Ancient Wisdom + Structured Intelligence + Modern Query Systems.
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="card shadow-premium p-6 sm:p-8 bg-white/80 backdrop-blur-sm animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">⚙️ Platform Architecture & Pages</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-l-4 border-l-emerald-500 border-border/50 bg-emerald-50/5 space-y-1">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  FAQ PAGE (Verified Base)
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  Houses verified, permanent, and category-organized questions. Features snap-scrolling categories, upvoting, and instant search.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-l-4 border-l-blue-500 border-border/50 bg-blue-50/5 space-y-1">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  RTQ PAGE (Real-Time Queries)
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  Live forum where students raise unresolved questions, submit multiple answers, and vote on peer feedback under Moderator and Senior supervision.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-l-4 border-l-amber-500 border-border/50 bg-amber-50/5 space-y-1">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  TRACK MY ISSUES
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  A dedicated dashboard for tracking submitted questions. Updates status in real-time (Green for resolved, Lite Blue for partially resolved, Red for unresolved).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-l-4 border-l-rose-500 border-border/50 bg-rose-50/5 space-y-1">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  RAISE QUESTION & RAG SCAN
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  Allows students to submit questions. Uses semantic evaluation to verify duplicates, applying QP penalties for lazy submissions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-l-4 border-l-purple-500 border-border/50 bg-purple-50/5 space-y-1 sm:col-span-2">
                <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  USER & ADMIN MANAGEMENT
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  Enables Seniors and Admins to govern the platform, assign roles, monitor Quality Point balances, and approve FAQ conversion requests.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economy' && (
          <div className="card shadow-premium p-6 sm:p-8 bg-white/80 backdrop-blur-sm animate-scaleIn space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">👥 Roles & Quality Point (QP) System</h2>
            </div>

            {/* Roles Descriptions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border/50 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Student</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Can raise questions, submit answers on RTQ forum, upvote content, and track submitted queries.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Moderator</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Has student abilities plus the power to accept/reject questions and approve/reject answers.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Senior / Admin</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Highest authority. Can add FAQs, toggle reviews, and convert forum discussions into permanent FAQs.
                </p>
              </div>
            </div>

            {/* QP Tables */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
              {/* Student Rules */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  Student QP Ledger
                </h3>
                <div className="overflow-x-auto border border-border/40 rounded-xl">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-border/40">
                      <tr>
                        <th className="px-3 py-2">Action</th>
                        <th className="px-3 py-2 text-right">QP Effect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="px-3 py-2">Raise Question - Rejected</td>
                        <td className="px-3 py-2 text-right text-red-600">-5 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Raise Question - Accepted</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+5 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Raise Question - Added to FAQ</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+20 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Post RTQ Answer</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+2 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Answer Approved by Mod/Senior</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+5 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Answer Removed</td>
                        <td className="px-3 py-2 text-right text-red-600">-3 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Answer Selected for FAQ</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+10 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Every 10 upvotes on content</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+1 QP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seniors & Mods Rules */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  Staff QP Ledger
                </h3>
                <div className="overflow-x-auto border border-border/40 rounded-xl">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-border/40">
                      <tr>
                        <th className="px-3 py-2">Action</th>
                        <th className="px-3 py-2 text-right">QP Effect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="px-3 py-2">Moderator Approval / Rejection</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+3 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Senior Approve / Remove Content</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+5 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Senior Answer Posted</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+5 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">RTQ to FAQ Conversion</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+10 QP</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Manual FAQ Creation</td>
                        <td className="px-3 py-2 text-right text-emerald-600">+15 QP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Restriction Rules */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-red-200/60 bg-red-50/20 text-red-800 text-sm mt-4">
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-900 leading-tight">⚠️ Global System Restrictions</p>
                <ul className="list-disc list-inside text-xs text-red-700 space-y-1 pt-1.5">
                  <li>Every user starts with a base balance of <strong>100 QP</strong>.</li>
                  <li>If your Quality Point balance falls <strong>below 50 QP</strong>, you will be restricted from raising new questions.</li>
                  <li>If your Quality Point balance drops into the <strong>negative (QP &lt; 0)</strong>, your account enters <strong>Restriction Mode (Read-Only)</strong>. You will be unable to raise questions, resolve queries, or post answers.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footervision */}
      <div className="mt-12 text-center p-6 border-t border-border/50">
        <h3 className="font-brand text-lg font-bold text-primary">🚀 Final Vision</h3>
        <p className="text-xs text-muted max-w-lg mx-auto mt-2 italic leading-relaxed">
          “PippaQ is not just a FAQ system. It is a knowledge intelligence ecosystem inspired by ancient wisdom and powered by modern AI: Where every question is validated, every answer is refined, and knowledge continuously evolves.”
        </p>
        {!user && (
          <div className="mt-4">
            <Link to="/login" className="btn-gradient-sm inline-flex items-center gap-1">
              Access the Platform <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
