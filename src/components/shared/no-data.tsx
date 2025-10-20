import { AlertCircle } from "lucide-react"; // Lucide icon

interface NoGamesMessageProps {
    infoText: string; 
    noGameTypeRecord?: string;
}

export function NoGamesMessage({ infoText, noGameTypeRecord } : NoGamesMessageProps) {
  return (
    <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded-md bg-gray-50 w-full h-full">
      <AlertCircle className="text-red-500 w-6 h-6" />
      <span className="text-sm text-gray-700">
        {!noGameTypeRecord ? (
          <>
            {infoText}. You have not attended any games for this league.
          </>
        ) : (
          <>
            You have not seen any {noGameTypeRecord} games for this league.
          </>
        )}
      </span>
    </div>
  );
};