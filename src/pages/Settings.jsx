import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Globe, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Settings() {
  const [settings, setSettings] = useState({
    language: 'english'
  });

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('practiceSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem('practiceSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLanguageChange = (language) => {
    const newSettings = { ...settings, language };
    saveSettings(newSettings);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <Card className="clay-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Language Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Musical Terms</h3>
                  <p className="text-sm text-gray-600">Choose between English and Latin-based terminology</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="language-toggle" className="text-sm font-medium">
                    {settings.language === 'english' ? 'English' : 'Latin'}
                  </Label>
                  <Switch
                    id="language-toggle"
                    checked={settings.language === 'latin'}
                    onCheckedChange={(checked) => handleLanguageChange(checked ? 'latin' : 'english')}
                  />
                </div>
              </div>

              {/* Language Examples */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🎼 Intervals</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minor Second:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'Minor Second' : 'Small Sekunda'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Perfect Fifth:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'Perfect Fifth' : 'Kvinta'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Octave:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'Perfect Octave' : 'Oktava'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎵 Notes</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">C4:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'C4' : 'Do4'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">E5:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'E5' : 'Mi5'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">A3:</span>
                      <span className="font-medium">{settings.language === 'english' ? 'A3' : 'La3'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Settings Placeholder */}
        <Card className="clay-card opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-500">More Settings</h2>
            </div>
            <p className="text-gray-500">Additional settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}