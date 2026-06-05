import { TermsAndConditionsContent } from "@/components/legal/terms-and-conditions-content";

export default function TermsAndConditionsPage() {
  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container">
        <section className="app-panel p-6 sm:p-8">
          <TermsAndConditionsContent />
        </section>
      </div>
    </main>
  );
}
