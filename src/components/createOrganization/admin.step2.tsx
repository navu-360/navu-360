import CreateOrganizationLayout from "components/layout/createOrgLayout";
import React, { useState } from "react";

export default function AdminCompanyDetails({
  goToNext,
  goToprev,
  loading,
}: {
  goToNext: (
    files: File[],
    role: string,
    companyDetails: {
      companyName: string;
      industry: string;
      noOfEmployees: string;
    }
  ) => void;
  goToprev: () => void;
  loading: boolean;
}) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [noOfEmployees, setNoOfEmployees] = useState("");

  return (
    <CreateOrganizationLayout
      goToNext={goToNext}
      goToprev={goToprev}
      files={[]}
      title="Setup your organization"
      desc="For the purpose of industry regulation, your details are required."
      loading={loading}
      role=""
      companyDetails={{
        companyName,
        industry,
        noOfEmployees,
      }}
      step={2}
    >
      <form className="mt-8 flex h-full w-max flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">What’s your company name?</label>
          <input
            type="text"
            name="name"
            id="name"
            className="common-input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="industry">What industry are you in?</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="common-input"
            name="industry"
            id="industry"
          >
            <option value="default" selected>
              Select industry
            </option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Energy">Energy</option>
            <option value="Construction">Construction</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Hospitality">Hospitality</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="noOfEmployees">How big is your company?</label>
          <select
            className="common-input"
            name="noOfEmployees"
            id="noOfEmployees"
            value={noOfEmployees}
            onChange={(e) => setNoOfEmployees(e.target.value)}
          >
            <option value="default" selected>
              Number of employees
            </option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-100">51-100</option>
            <option value="101-500">101-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5001-10000">More then 5000</option>
          </select>
        </div>
      </form>
    </CreateOrganizationLayout>
  );
}
