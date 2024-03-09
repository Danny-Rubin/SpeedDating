export const homepage_steps = [
    {
        target: 'body',
        placement: 'center',
        title: 'Welcome to FlashFlirt!',
        content: 'Discover the exciting features available to you.',
    },
    {
        target: '.start-dating-button',
        title: 'Ready to find your match?',
        content: 'Click the Start Dating button and start a speed dating session with' +
            ' potential soulmates.\n' +
            'Who knows, your perfect match might be just a click away!',
        disableBeacon: true
    },
    {
        target: '.shared-details-button',
        title: 'Explore your connections!',
        content: 'If someone you met during a speed dating session' +
            ' liked you and shared their contact details, you will find them here.'
        ,
        disableBeacon: true
    },
    {
        target: '.header-edit-profile',
        title: 'Fine-tune your profile!',
        content: 'Update your attraction preferences, contact details and profile picture.',
        disableBeacon: true
    },
];

export const videochat_steps = [
    {
        target: '.video-chat-actions-card',
        content: 'Lets dive into the video chat page!',
        disableBeacon: true
    },
    {
        target: '.video-chat-timer',
        content: 'Each date lasts for 3 minutes. You can see the time left here.\nMake the most of your time and enjoy the conversation!',
        disableBeacon: true

    },
    {
        target: '.add-time-btn',
        title: 'Need more time?',
        content: 'Click here to ask to extend the date by 3 minutes, the date will be extended only in case both participants want too. You can use this once per date.',
        disableBeacon: true
        ,
    },
    {
        target: '.next-conversation-btn',
        title: 'Ready for the next date?',
        content: 'Click here to gracefully end the current date and start the next conversation.',
        disableBeacon: true
        ,
    },
    {
        target: '.close-button',
        title: 'Ready to wrap up?',
        content: 'Click here to gracefully end the date and return to the homepage.',
        disableBeacon: true
        ,
    },
];
