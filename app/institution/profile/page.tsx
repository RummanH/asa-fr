"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, type ReactNode, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import {
  ApiError,
  createInstitutionProfile,
  fetchInstitutionProfile,
  uploadImage,
  updateInstitutionProfile,
  type InstitutionProfilePayload,
} from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";
import { redesignImages } from "@/components/landing/redesign-images";

export default function InstitutionProfilePage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading institution profile...">
      {({ accessToken }) => <InstitutionProfileForm accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type InstitutionProfileFormProps = {
  accessToken: string;
};

function InstitutionProfileForm({ accessToken }: InstitutionProfileFormProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [institutionName, setInstitutionName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    fetchInstitutionProfile(accessToken)
      .then((profile) => {
        setProfileExists(true);
        setInstitutionName(profile.institutionName);
        setPhone(profile.phone ?? "");
        setAddress(profile.address ?? "");
        setWebsite(profile.website ?? "");
        setDescription(profile.description ?? "");
        setLogo(profile.logo ?? "");
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          setProfileExists(false);
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Failed to load profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken]);

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setIsUploadingLogo(true);
    setErrorMessage("");

    try {
      const result = await uploadImage(accessToken, selectedFile);
      setLogo(result.url);
      showToast("Logo uploaded.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload logo";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsUploadingLogo(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: InstitutionProfilePayload = {
        institutionName: institutionName.trim(),
        phone,
        address,
        website,
        description,
        logo,
      };

      if (profileExists) {
        await updateInstitutionProfile(accessToken, payload);
      } else {
        await createInstitutionProfile(accessToken, payload);
        setProfileExists(true);
      }

      showToast("Institution profile saved successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .ip-root {
            margin: 0 -0.45rem;
            padding: 0 0 1.5rem !important;
          }
          .ip-shell {
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .ip-shell {
            padding: 1rem 0.95rem 1.5rem !important;
          }
        }
      `}</style>

      <main className="ip-root app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container">
        <section className="ip-shell app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <span className="relative inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-brand-navy/10 bg-brand-light">
                <Image alt="Institution" className="object-contain" fill sizes="48px" src={redesignImages.logoMark} />
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-brand-navy">Institution Profile</h1>
                <p className="mt-1 text-xs text-brand-navy/60">{profileExists ? "Update institution profile details." : "Create institution profile."}</p>
              </div>
            </div>
            <Link className="app-btn-secondary" href="/institution/dashboard">
              Back to Dashboard
            </Link>
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Institution Name">
              <input
                className={inputClassName}
                value={institutionName}
                minLength={2}
                required
                onChange={(e) => setInstitutionName(e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input className={inputClassName} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Address">
              <input
                className={inputClassName}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>
            <Field label="Website URL">
              <input
                className={inputClassName}
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Field>
            <Field label="Logo">
              <input
                accept="image/*"
                className={inputClassName}
                disabled={isUploadingLogo}
                onChange={handleLogoUpload}
                type="file"
              />
            </Field>
            <Field label="Logo URL">
              <input className={inputClassName} type="url" value={logo} onChange={(e) => setLogo(e.target.value)} />
            </Field>
            {logo ? (
              <div className="md:col-span-2 text-sm text-brand-navy/75">
                Uploaded URL:{" "}
                <a className="text-brand-cyan underline" href={logo} rel="noreferrer" target="_blank">
                  Open image
                </a>
              </div>
            ) : null}
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={`app-textarea min-h-24`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </div>

            {errorMessage ? (
              <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="md:col-span-2">
              <button
                className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || isUploadingLogo}
                type="submit"
              >
                {isSubmitting
                  ? "Saving..."
                  : isUploadingLogo
                    ? "Uploading logo..."
                    : profileExists
                      ? "Update Profile"
                      : "Create Profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
    </>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm text-brand-navy/90">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "app-input";

