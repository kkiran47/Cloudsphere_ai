import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Brain, Shield, Zap, Search, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    { icon: <Search size={28} />, title: 'Semantic Search', desc: 'Find files using natural language. No more remembering exact filenames.' },
    { icon: <MessageSquare size={28} />, title: 'Chat with Files', desc: 'Ask questions and get answers directly from your uploaded documents.' },
    { icon: <Brain size={28} />, title: 'Auto Categorization', desc: 'AI automatically tags and organizes your files as soon as you upload them.' },
    { icon: <Shield size={28} />, title: 'Enterprise Security', desc: 'Bank-grade encryption, secure sharing, and role-based access control.' },
    { icon: <Zap size={28} />, title: 'OCR Intelligence', desc: 'Extract text from images and scanned PDFs instantly.' },
    { icon: <Cloud size={28} />, title: 'Cloud Infrastructure', desc: 'Built on scalable, highly available cloud infrastructure.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-brand-500 selection:text-white ambient-bg relative overflow-hidden">
      
      {/* Nav */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10 glass-panel mt-4 rounded-3xl">
        <div className="flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500 font-extrabold text-2xl tracking-tight">
          <Cloud size={32} className="text-brand-600" />
          <span>CloudSphere AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pricing</a>
          <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Login</Link>
          <Link to="/register" className="bg-gradient-to-r from-brand-600 to-brand-500 text-white px-7 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-brand-500/30 font-bold">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-32 pb-40 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card text-brand-700 dark:text-brand-300 font-bold text-sm mb-10 border border-brand-500/30"
          >
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
            </span>
            Introducing CloudSphere AI 2.0
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-10 leading-[1.1]">
            The Intelligent <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-500">Cloud Storage</span> Platform
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Upload your files, and let AI do the rest. Search by meaning, chat with your documents, and automatically organize your digital life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-500 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-2xl shadow-brand-500/40 hover:scale-105 hover:shadow-brand-500/60">
              Start for Free <ArrowRight size={24} />
            </Link>
            <a href="#features" className="w-full sm:w-auto flex items-center justify-center px-10 py-5 rounded-full text-xl font-bold glass-card hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all">
              See how it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Everything you need, supercharged by AI</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">CloudSphere doesn't just store your files; it understands them.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2rem] glass-card group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 glass-panel mt-20 border-b-0 border-x-0 rounded-t-[3rem]">
        <div className="container mx-auto px-6 text-center text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-3 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500 font-extrabold text-xl">
            <Cloud size={28} className="text-brand-600" />
            <span>CloudSphere AI</span>
          </div>
          <p>© 2026 CloudSphere AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
