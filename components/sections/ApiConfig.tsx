"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ExternalLink, Info } from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { ProviderName, providers, getProvider } from "@/lib/providers";

interface ApiConfigProps {
  provider: ProviderName;
  onProviderChange: (p: ProviderName) => void;
  model: string;
  onModelChange: (m: string) => void;
  apiKey: string;
  onApiKeyChange: (k: string) => void;
  disabled: boolean;
}

export default function ApiConfig({
  provider,
  onProviderChange,
  model,
  onModelChange,
  apiKey,
  onApiKeyChange,
  disabled,
}: ApiConfigProps) {
  const [securityModal, setSecurityModal] = useState(false);
  const currentProvider = getProvider(provider);

  return (
    <section id="config" className="pt-24 pb-8 px-6 md:px-8">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
            Configure your test
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Choose your provider and enter your API key
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto space-y-5"
        >
          {/* Provider + Model row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Provider"
              options={providers.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              value={provider}
              onChange={(v) => {
                const p = v as ProviderName;
                onProviderChange(p);
                const first = getProvider(p).models[0];
                if (first) onModelChange(first.id);
              }}
            />
            <Select
              label="Model"
              options={currentProvider.models.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
              value={model}
              onChange={onModelChange}
            />
          </div>

          {/* API Key */}
          <div>
            <Input
              label="API Key"
              masked
              icon={<Lock className="w-4 h-4" />}
              placeholder={currentProvider.keyPlaceholder}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              disabled={disabled}
            />
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => setSecurityModal(true)}
                className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                How we protect your key
              </button>
              <a
                href={currentProvider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Get an API key
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Security Modal */}
        <Modal
          open={securityModal}
          onClose={() => setSecurityModal(false)}
          title="Your API key is safe"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  Stays in your browser
                </p>
                <p className="text-text-tertiary text-xs mt-0.5">
                  Your key is sent directly to {currentProvider.name}&apos;s API from
                  your browser. It passes through our server only to avoid CORS
                  restrictions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  Never stored or logged
                </p>
                <p className="text-text-tertiary text-xs mt-0.5">
                  We never store, log, or have access to your API key. It exists
                  only in memory during the test.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  Open source
                </p>
                <p className="text-text-tertiary text-xs mt-0.5">
                  Our entire codebase is open source. Verify our security
                  practices yourself.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
}
