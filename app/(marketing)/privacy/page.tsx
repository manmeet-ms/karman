import React from 'react';

export default function PrivacyPolicy() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Privacy Protocol</h1>
        <div className="prose prose-lg dark:prose-invert text-muted-foreground">
          <p className="mb-6">
            This is not a standard privacy policy full of legal obfuscation. Ideally, you should read this.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Ownership & Liability</h2>
          <p className="mb-6">
            Data is stored in a structured database. While we secure access, you must understand: <strong>Data is ultimately not in our hands.</strong> We use third-party providers for hosting and storage. Enter your data carefully. Do not treat this system as a vault for state secrets. treating it as such is a violation of operational security.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Collection</h2>
          <p className="mb-6">
            We do not aggressively collect metadata for advertising. We extract compliance data to enforce the rules you set.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">Future AI Processing</h2>
          <p className="mb-6">
            <strong>Warning:</strong> We are planning to implement weekly AI reports. When this feature activates, your data logs, violation history, and self-negotiation attempts will be sent to Large Language Model (LLM) servers via API for analysis.
          </p>
          <p className="mb-6">
            The purpose of this processing is to generate ruthless analysis of your failures and highlight patterns of self-deception. If you are uncomfortable with an AI analyzing your lack of discipline, do not use this feature when it launches.
          </p>

          <p className="font-bold text-foreground">
            We prioritize your discipline over your privacy. The system works because it sees you.
          </p>
        </div>
      </div>
    </section>
  );
}
