import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { IUser } from "@/types/users";

interface ContactsListProps {
  contacts: IUser[];
  title: string;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, title }) => {
  if (contacts.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {contacts.map(contact => (
          <div
            key={contact.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5 text-blue-500" />
                <h3 className="text-md font-medium text-gray-900">
                  {contact.name}
                </h3>
              </div>

              {/* Contact Details */}
              <div className="mt-3 space-y-2">
                {contact.emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {email.address}
                  </div>
                ))}

                {contact.phones.map((phone, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {phone.number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
