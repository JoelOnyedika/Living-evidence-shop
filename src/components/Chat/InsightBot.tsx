import React from 'react';

const CONTACT_INFO_REGEX = /(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|\b(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|twitter|instagram|linkedin)\.com\/[A-Za-z0-9_.-]+\b/g;

export function filterMessage(message) {
  return message.replace(CONTACT_INFO_REGEX, '[REDACTED]');
}

export function containsContactInfo(message) {
  return CONTACT_INFO_REGEX.test(message);
}

export function InsightBot({ message }) {
  return (
    <div className="flex items-end">
      <div className="bg-yellow-100 text-yellow-800 rounded-lg p-3 max-w-[80%]">
        <p className="font-bold">Insight Bot:</p>
        <p>{message}</p>
      </div>
    </div>
  );
}