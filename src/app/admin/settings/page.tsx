'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Key,
  ToggleLeft,
  ToggleRight,
  Save,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const {
    appSettings,
    isLoading,
    error,
    successMessage,
    fetchAppSettings,
    updateGeminiApiKey,
    toggleRegistration,
    updateAppSettings,
    clearMessages,
  } = useAdminStore();

  // API Key state
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingApiKey, setSavingApiKey] = useState(false);

  // Registration state
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [savingRegistration, setSavingRegistration] = useState(false);

  // Feature flags state
  const [features, setFeatures] = useState({
    aiPronunciationFeedback: true,
    speechRecognition: true,
    chatbot: true,
  });
  const [savingFeatures, setSavingFeatures] = useState(false);

  // Load settings
  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  // Update local state when settings load
  useEffect(() => {
    if (appSettings) {
      setApiKey(appSettings.geminiApiKey || '');
      setRegistrationEnabled(appSettings.registrationEnabled);
      setRegistrationMessage(appSettings.registrationDisabledMessage || '');
      setFeatures(appSettings.features);
    }
  }, [appSettings]);

  const handleSaveApiKey = async () => {
    if (!user?.uid) return;
    setSavingApiKey(true);
    try {
      await updateGeminiApiKey(apiKey, user.uid);
    } catch {
      // Error handled by store
    }
    setSavingApiKey(false);
  };

  const handleToggleRegistration = async () => {
    if (!user?.uid) return;
    setSavingRegistration(true);
    try {
      const newEnabled = !registrationEnabled;
      await toggleRegistration(
        newEnabled,
        newEnabled ? undefined : registrationMessage,
        user.uid
      );
      setRegistrationEnabled(newEnabled);
    } catch {
      // Error handled by store
    }
    setSavingRegistration(false);
  };

  const handleSaveRegistrationMessage = async () => {
    if (!user?.uid) return;
    setSavingRegistration(true);
    try {
      await toggleRegistration(registrationEnabled, registrationMessage, user.uid);
    } catch {
      // Error handled by store
    }
    setSavingRegistration(false);
  };

  const handleSaveFeatures = async () => {
    if (!user?.uid) return;
    setSavingFeatures(true);
    try {
      await updateAppSettings({ features }, user.uid);
    } catch {
      // Error handled by store
    }
    setSavingFeatures(false);
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">App Settings</h1>
        <p className="text-gray-400 mt-1">
          Configure API keys, registration, and app features
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
          <button onClick={clearMessages}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={clearMessages}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Gemini API Key */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5 text-yellow-400" />
            Gemini API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Configure the Google Gemini API key for AI-powered pronunciation feedback.
          </p>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={showApiKey ? apiKey : maskApiKey(apiKey)}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Info className="w-4 h-4" />
              <span>
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </span>
            </div>

            <Button
              onClick={handleSaveApiKey}
              isLoading={savingApiKey}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600"
            >
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registration Settings */}
      <Card className="bg-gray-800/50 border-gray-700" id="registration">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            {registrationEnabled ? (
              <ToggleRight className="w-5 h-5 text-green-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-red-400" />
            )}
            User Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Control whether new users can register for the app. Useful during holidays or
            maintenance periods.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
            <div>
              <p className="font-medium text-white">Registration Status</p>
              <p className="text-sm text-gray-400">
                {registrationEnabled
                  ? 'New users can create accounts'
                  : 'Registration is currently closed'}
              </p>
            </div>
            <button
              onClick={handleToggleRegistration}
              disabled={savingRegistration}
              className={cn(
                'relative w-14 h-8 rounded-full transition-colors',
                registrationEnabled ? 'bg-green-500' : 'bg-gray-600'
              )}
            >
              <motion.div
                animate={{ x: registrationEnabled ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
              />
            </button>
          </div>

          {/* Disabled Message */}
          {!registrationEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message for Users
                </label>
                <textarea
                  value={registrationMessage}
                  onChange={(e) => setRegistrationMessage(e.target.value)}
                  placeholder="Enter a message to show users when registration is closed..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
              <Button
                onClick={handleSaveRegistrationMessage}
                isLoading={savingRegistration}
                leftIcon={<Save className="w-4 h-4" />}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Save Message
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5 text-purple-400" />
            Feature Toggles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Enable or disable specific features across the app.
          </p>

          <div className="space-y-3">
            {/* AI Pronunciation Feedback */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <p className="font-medium text-white">AI Pronunciation Feedback</p>
                <p className="text-sm text-gray-400">
                  Gemini-powered pronunciation analysis
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatures({
                    ...features,
                    aiPronunciationFeedback: !features.aiPronunciationFeedback,
                  })
                }
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  features.aiPronunciationFeedback ? 'bg-purple-500' : 'bg-gray-600'
                )}
              >
                <motion.div
                  animate={{ x: features.aiPronunciationFeedback ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>

            {/* Speech Recognition */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <p className="font-medium text-white">Speech Recognition</p>
                <p className="text-sm text-gray-400">
                  Web Speech API for voice input
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatures({
                    ...features,
                    speechRecognition: !features.speechRecognition,
                  })
                }
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  features.speechRecognition ? 'bg-purple-500' : 'bg-gray-600'
                )}
              >
                <motion.div
                  animate={{ x: features.speechRecognition ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>

            {/* Chatbot */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <p className="font-medium text-white">Phoni Chatbot</p>
                <p className="text-sm text-gray-400">
                  Helper chatbot on all pages
                </p>
              </div>
              <button
                onClick={() =>
                  setFeatures({
                    ...features,
                    chatbot: !features.chatbot,
                  })
                }
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  features.chatbot ? 'bg-purple-500' : 'bg-gray-600'
                )}
              >
                <motion.div
                  animate={{ x: features.chatbot ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>
          </div>

          <Button
            onClick={handleSaveFeatures}
            isLoading={savingFeatures}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
          >
            Save Feature Settings
          </Button>
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      {appSettings?.updatedAt && (
        <div className="text-center text-sm text-gray-500">
          Last updated:{' '}
          {new Date(appSettings.updatedAt).toLocaleString()}
          {appSettings.updatedBy && ` by ${appSettings.updatedBy}`}
        </div>
      )}
    </div>
  );
}
