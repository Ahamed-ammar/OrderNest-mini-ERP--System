import { STATUS_COLORS, STATUS_DISPLAY_NAMES } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const displayName = STATUS_DISPLAY_NAMES[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {displayName}
    </span>
  );
};

export default StatusBadge;
