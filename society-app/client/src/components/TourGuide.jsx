import { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

const Tooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep
}) => (
  <div {...tooltipProps} className="tour-tooltip">
    {step.title && <h4 className="tour-title">{step.title}</h4>}
    <div className="tour-content">{step.content}</div>
    <div className="tour-footer">
      {!isLastStep && (
        <button {...skipProps} className="tour-btn-skip">
          Skip Tour
        </button>
      )}
      <div className="tour-actions">
        {index > 0 && (
          <button {...backProps} className="tour-btn-back">
            Back
          </button>
        )}
        <button {...primaryProps} className="tour-btn-next">
          {isLastStep ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
    <button {...closeProps} className="tour-close-x">✕</button>
  </div>
);

const TourGuide = ({ run, onComplete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [steps] = useState([
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to SocietySync! 🏘️',
      content: 'Let\'s take a quick tour to help you get started with managing your society effortlessly.',
      disableBeacon: true,
    },
    {
      target: '.stats-grid',
      title: 'Dashboard Overview',
      content: isAdmin 
        ? 'Get a bird\'s-eye view of your society\'s finances, collections, and pending dues here.'
        : 'Track your personal maintenance status, paid amounts, and any outstanding dues.',
    },
    {
      target: '#nav-blocks',
      title: 'Blocks & Flats',
      content: 'Manage building blocks and view individual flat details. Colors indicate payment status at a glance.',
    },
    {
      target: '#nav-payments',
      title: 'Maintenance Tracking',
      content: isAdmin
        ? 'Generate bills and track monthly maintenance payments for all residents.'
        : 'View your maintenance history and download digital receipts for your records.',
    },
    {
      target: '#nav-funds',
      title: 'Society Funds',
      content: 'Manage special collections like festival funds or emergency repairs outside regular maintenance.',
    },
    ...(isAdmin ? [
      {
        target: '#nav-payment-verification',
        title: 'Payment Verification',
        content: 'Review and approve payment receipts submitted by residents to keep records accurate.',
      },
      {
        target: '#nav-expenses',
        title: 'Expense Management',
        content: 'Track every rupee spent by the society on electricity, cleaning, security, and repairs.',
      },
      {
        target: '#nav-reports',
        title: 'Reports & Analytics',
        content: 'Generate detailed financial statements and visualize collection trends over time.',
      }
    ] : []),
    {
      target: '#theme-toggle',
      title: 'Dark Mode',
      content: 'Prefer a different look? Switch between Light and Dark mode anytime!',
    },
    {
      target: '#nav-settings',
      title: 'All Set! ✅',
      content: 'You can replay this tour anytime from the Settings menu. Enjoy using SocietySync!',
    }
  ]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={false}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={Tooltip}
      styles={{
        options: {
          zIndex: 10000,
        }
      }}
    />
  );
};

export default TourGuide;
