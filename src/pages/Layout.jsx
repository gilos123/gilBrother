

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Award, Target, Trophy, Music, Info } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100">
      <style>
        {`
          :root {
            --clay-primary: #8b5cf6;
            --clay-secondary: #ec4899;
            --clay-accent: #f59e0b;
            --clay-light: #fef7ff;
            --clay-dark: #1f2937;
          }
          
          body {
            margin: 0;
            padding: 0;
            /* Removed overflow-x: hidden; to centralize the fix in the div above */
          }
          
          * {
            box-sizing: border-box;
          }
          
          .clay-card {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            box-shadow: 
              8px 8px 16px rgba(0, 0, 0, 0.05),
              -8px -8px 16px rgba(255, 255, 255, 0.7);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .clay-button {
            background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
            box-shadow: 
              5px 5px 10px rgba(0, 0, 0, 0.08),
              -5px -5px 10px rgba(255, 255, 255, 0.9);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease-in-out;
          }
          
          .clay-button:hover {
            box-shadow: 
              2px 2px 5px rgba(0, 0, 0, 0.1),
              -2px -2px 5px rgba(255, 255, 255, 1);
            transform: translateY(-1px);
          }
          
          .clay-button:active {
            box-shadow: 
              inset 3px 3px 6px rgba(0, 0, 0, 0.1),
              inset -3px -3px 6px rgba(255, 255, 255, 1);
            transform: translateY(1px);
          }
          
          .clay-header {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(248, 250, 252, 0.6));
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            border-radius: 0 0 24px 24px;
          }
          
          .clay-icon {
            background: linear-gradient(145deg, #8b5cf6, #a855f7);
            box-shadow: 
              4px 4px 8px rgba(139, 92, 246, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.5);
            border-radius: 12px;
          }

          @keyframes godlike-background-pan {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .godlike-animated-bg {
            background-size: 400% 400%;
            animation: godlike-background-pan 8s ease infinite;
          }
          
          .glowing-crown {
            filter: drop-shadow(0 0 3px #fde047) drop-shadow(0 0 8px #facc15);
            animation: crown-glow 2.5s ease-in-out infinite;
          }

          @keyframes crown-glow {
            0%, 100% {
              filter: drop-shadow(0 0 3px #fde047) drop-shadow(0 0 8px #facc15);
            }
            50% {
              filter: drop-shadow(0 0 6px #fde047) drop-shadow(0 0 12px #facc15);
            }
          }
          
          .bounce-in {
            animation: clayBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          
          @keyframes clayBounceIn {
            0% { transform: scale(0.3) translateY(50px); opacity: 0; }
            50% { transform: scale(1.1) translateY(-10px); opacity: 0.8; }
            100% { transform: scale(1) translateY(0px); opacity: 1; }
          }
        `}
      </style>
      
      {/* Header */}
      <header className="clay-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-full">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="clay-icon w-12 h-12 flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Practice!</h1>
            </Link>
            
            <nav className="flex items-center gap-2">
              <Link 
                to={createPageUrl("Home")}
                className={`clay-button p-3 transition-all duration-200 ${
                  location.pathname === createPageUrl("Home") 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Home className="w-5 h-5" />
              </Link>
              {/* Drumline Link (BookOpen icon) REMOVED */}
              <Link 
                to={createPageUrl("Badges")}
                className={`clay-button p-3 transition-all duration-200 ${
                  location.pathname === createPageUrl("Badges") 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Award className="w-5 h-5" />
              </Link>
              <Link 
                to={createPageUrl("Arena")}
                className={`clay-button p-3 transition-all duration-200 ${
                  location.pathname === createPageUrl("Arena") 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Trophy className={`w-5 h-5 ${location.pathname === createPageUrl("Arena") ? 'glowing-crown' : ''}`} />
              </Link>
              <Link 
                to={createPageUrl("LevelTester")}
                className={`clay-button p-3 transition-all duration-200 ${
                  location.pathname === createPageUrl("LevelTester") 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Target className="w-5 h-5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      {/* Footer for mobile navigation if needed */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
}

