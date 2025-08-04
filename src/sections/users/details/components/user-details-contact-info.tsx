import React from "react";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import StatusBadge from "@/components/badge/status-badge";
import { IUser } from "@/types/users";

interface ContactInfoProps {
  user: IUser;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ user }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Contact Information
      </h2>

      {/* Emails */}
      <div className="space-y-4">
        {user.emails.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Email Addresses
            </h3>
            <div className="space-y-2">
              {user.emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{email.address}</span>
                  </div>
                  <StatusBadge isActive={email.isVerified} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phone Numbers */}
        {user.phones.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Phone Numbers
            </h3>
            <div className="space-y-2">
              {user.phones.map((phone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{phone.number}</span>
                  </div>
                  <StatusBadge isActive={phone.isVerified} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
