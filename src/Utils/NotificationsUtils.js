export const NOFICATION_PREF = [
    {
        id: 1,
        title: 'Networking alerts',
        key: 'notificationAlert',
        data: [
            {
                id: 1,
                title: 'Friend request received',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendRequestReceived',
            },
            {
                id: 2,
                title: 'Friend request accepted',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendRequestAccepted',
            },
            {
                id: 3,
                title: 'Friend added 1st goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendAddedFirstGoal',
            },
            {
                id: 4,
                title: 'Friend accomplishes goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendAccomplishedGoal',
            },
            {
                id: 5,
                title: 'Friend you invited just joined GM',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'invitedFriendJoined',
            },
            {
                id: 6,
                title: 'Someone from your contact list joined GM',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'contacteeJoined',
            },
        ],
    },
    {
        id: 2,
        title: 'Help request',
        key: 'helpRequest',
        data: [
            // {
            //     id: 1,
            //     title: 'Friend posted a help request ',
            //     pushNotification: true,
            //     email: true,
            //     sms: true,
            // key: 'friendPosted',

            // },
            {
                id: 1,
                title: 'Posts a Need for their goal ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'postsNeedForGoal',
            },
        ],
    },
    {
        id: 3,
        title: 'Comments',
        key: 'comments',
        data: [
            {
                id: 1,
                title: 'Comments on your goal ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'commentOnGoal',
            },
            {
                id: 2,
                title: 'Comments on your Updates ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'commentOnUpdate',
            },
            // {
            //     id: 3,
            //     title: 'Comments on your Steps',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 4,
            //     title: 'Comments on your Needs',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            {
                id: 3,
                title: 'Replies to your comments',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'replyToComment',
            },
            {
                id: 4,
                title: 'Suggestions received',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'suggestionReceived',
            },
            {
                id: 5,
                title: 'Replies to your suggestions',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'replyToSuggestion',
            },
            // {
            //     id: 9,
            //     title: 'Makes a comment on your Suggestion',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 10,
            //     title: 'Makes a comment on your Step',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 11,
            //     title: 'Makes a comment on your Need',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 12,
            //     title: 'Comments after you on a comment you made',
            //     pushNotification: false,
            //     email: false,
            //     sms: false,
            // },
            // {
            //     id: 13,
            //     title: `A friend comments on another friend's posts`,
            //     pushNotification: false,
            //     email: false,
            //     sms: false,
            // },
        ],
    },
    {
        id: 4,
        title: 'Activity about you',
        key: 'yourActivity',
        data: [
            {
                id: 1,
                title: 'Tags you in a post or comment',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'tagsInPostOrComment',
            },
            {
                id: 2,
                title: 'Shares your goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'sharesYourGoal',
            },
            {
                id: 3,
                title: 'Shares your Updates',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'sharesYourUpdates',
            },
            {
                id: 4,
                title: 'Nudges you to clarify your goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'nudge',
            },
            {
                id: 5,
                title: 'Someone views your profile',
                pushNotification: false,
                email: true,
                sms: false,
                key: 'videoUploadReady',
            },
            // {
            //     id: 6,
            //     title: 'When your video upload is ready',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
        ],
    },
    {
        id: 5,
        title: 'Likes',
        key: 'likes',
        data: [
            {
                id: 1,
                title: 'Likes your goal',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'goalLike',
            },
            {
                id: 2,
                title: 'Likes your update',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'updateLike',
            },
            {
                id: 3,
                title: 'Likes your comment',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'commentLike',
            },
            {
                id: 4,
                title: 'Likes your Tribe post',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'tribePostLike',
            },
            {
                id: 5,
                title: 'Likes your suggestion',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'sugesstionLike',
            },
        ],
    },
    {
        id: 6,
        title: 'Tribe activity',
        key: 'tribeActivity',
        data: [
            {
                id: 1,
                title: 'Requests to join your tribe',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'joinTribeRequest',
            },
            {
                id: 2,
                title: 'Accepts your Tribe invitation',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'acceptTribeInvite',
            },
            {
                id: 3,
                title: 'Accepts your request to join Tribe',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'acceptRequestJoinTribe',
            },
            {
                id: 4,
                title: 'Invites you to join their Tribe',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'joinTribeInvitation',
            },
            {
                id: 5,
                title: 'Posts in a Tribe you moderate',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'postsInTribe',
            },
            {
                id: 6,
                title: 'Tribe posts by Admins',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'adminPosts',
            },
            {
                id: 7,
                title: 'Tribe posts by Members',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'memberPosts',
            },
        ],
    },
    // {
    //     id: 7,
    //     title: 'Accountability',
    //     key: 'accountability',
    //     data: [
    //         {
    //             id: 1,
    //             title: 'Asking you to be AB',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 2,
    //             title: 'Wants to hold you accountable for your goals',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 3,
    //             title: 'Accountability Session confirmed',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 4,
    //             title: 'Accountability 1 day reminder',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 5,
    //             title: 'Accountability session now',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 6,
    //             title: 'Accountability rescheduled',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 7,
    //             title: 'Accountability canceled',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //     ],
    // },
    {
        id: 7,
        title: 'Productivity',
        key: 'productivity',
        data: [
            {
                id: 1,
                title: 'Reminders for Bronze Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForBronzeBadge',
            },
            {
                id: 2,
                title: 'Reminder of Silver Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForGoldBadge',
            },
            {
                id: 3,
                title: 'Reminder of Gold Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForSilverBadge',
            },
            {
                id: 4,
                title: 'Reminder to Set 1st Goal',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForFirstGoal',
            },
            {
                id: 5,
                title: 'Reminder to Set New Goals Every 14 days',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForNewGoals',
            },
            {
                id: 6,
                title: 'Reminder to Update Goal Once a week',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForUpdateGoal',
            },
            {
                id: 7,
                title: 'Friend added a new goal (max 1/day)',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'friendsNewGoal',
            },
            {
                id: 8,
                title: 'New Tribe messages posted',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'newTribeMessage',
            },
            {
                id: 9,
                title: 'You have unread messages',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'reminderForUnreadMessages',
            },
        ],
    },
    {
        id: 8,
        title: 'Chat conversations',
        key: 'chatConversation',
        data: [
            {
                id: 1,
                title: 'Upon receiving a Chat message ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'chatMessageReceived',
            },
            // {
            //     id: 2,
            //     title: 'Messages Daily Summary ',
            //     pushNotification: null,
            //     email: true,
            //     sms: null,
            // },
            // {
            //     id: 3,
            //     title: 'Messages Daily Summary ',
            //     pushNotification: null,
            //     email: true,
            //     sms: null,
            // },
        ],
    },
    // {
    //     id: 10,
    //     title: 'What you’ve missed - email report',
    //     key: 'emailReport',
    // },
    // {
    //     id: 11,
    //     title: 'Goal Reminders',
    //     key: 'goalReminder',
    // },
]

export const INITIAL_DATA = [
    {
        id: 1,
        title: 'Networking alerts',
        key: 'notificationAlert',
        data: [
            {
                id: 1,
                title: 'Friend request received',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendRequestReceived',
            },
            {
                id: 2,
                title: 'Friend request accepted',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendRequestAccepted',
            },
            {
                id: 3,
                title: 'Friend added 1st goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendAddedFirstGoal',
            },
            {
                id: 4,
                title: 'Friend accomplishes goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'friendAccomplishedGoal',
            },
            {
                id: 5,
                title: 'Friend you invited just joined GM',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'invitedFriendJoined',
            },
            {
                id: 6,
                title: 'Someone from your contact list joined GM',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'contacteeJoined',
            },
        ],
    },
    {
        id: 2,
        title: 'Help request',
        key: 'helpRequest',
        data: [
            // {
            //     id: 1,
            //     title: 'Friend posted a help request ',
            //     pushNotification: true,
            //     email: true,
            //     sms: true,
            // key: 'friendPosted',

            // },
            {
                id: 1,
                title: 'Posts a Need for their goal ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'postsNeedForGoal',
            },
        ],
    },
    {
        id: 3,
        title: 'Comments',
        key: 'comments',
        data: [
            {
                id: 1,
                title: 'Comments on your goal ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'commentOnGoal',
            },
            {
                id: 2,
                title: 'Comments on your Updates ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'commentOnUpdate',
            },
            // {
            //     id: 3,
            //     title: 'Comments on your Steps',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 4,
            //     title: 'Comments on your Needs',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            {
                id: 3,
                title: 'Replies to your comments',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'replyToComment',
            },
            {
                id: 4,
                title: 'Suggestions received',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'suggestionReceived',
            },
            {
                id: 5,
                title: 'Replies to your suggestions',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'replyToSuggestion',
            },
            // {
            //     id: 9,
            //     title: 'Makes a comment on your Suggestion',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 10,
            //     title: 'Makes a comment on your Step',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 11,
            //     title: 'Makes a comment on your Need',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
            // {
            //     id: 12,
            //     title: 'Comments after you on a comment you made',
            //     pushNotification: false,
            //     email: false,
            //     sms: false,
            // },
            // {
            //     id: 13,
            //     title: `A friend comments on another friend's posts`,
            //     pushNotification: false,
            //     email: false,
            //     sms: false,
            // },
        ],
    },
    {
        id: 4,
        title: 'Activity about you',
        key: 'yourActivity',
        data: [
            {
                id: 1,
                title: 'Tags you in a post or comment',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'tagsInPostOrComment',
            },
            {
                id: 2,
                title: 'Shares your goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'sharesYourGoal',
            },
            {
                id: 3,
                title: 'Shares your Updates',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'sharesYourUpdates',
            },
            {
                id: 4,
                title: 'Nudges you to clarify your goal',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'nudge',
            },
            {
                id: 5,
                title: 'Someone views your profile',
                pushNotification: false,
                email: true,
                sms: false,
                key: 'videoUploadReady',
            },
            // {
            //     id: 6,
            //     title: 'When your video upload is ready',
            //     pushNotification: true,
            //     email: true,
            //     sms: false,
            // },
        ],
    },
    {
        id: 5,
        title: 'Likes',
        key: 'likes',
        data: [
            {
                id: 1,
                title: 'Likes your goal',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'goalLike',
            },
            {
                id: 2,
                title: 'Likes your update',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'updateLike',
            },
            {
                id: 3,
                title: 'Likes your comment',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'commentLike',
            },
            {
                id: 4,
                title: 'Likes your Tribe post',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'tribePostLike',
            },
            {
                id: 5,
                title: 'Likes your suggestion',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'sugesstionLike',
            },
        ],
    },
    {
        id: 6,
        title: 'Tribe activity',
        key: 'tribeActivity',
        data: [
            {
                id: 1,
                title: 'Requests to join your tribe',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'joinTribeRequest',
            },
            {
                id: 2,
                title: 'Accepts your Tribe invitation',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'acceptTribeInvite',
            },
            {
                id: 3,
                title: 'Accepts your request to join Tribe',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'acceptRequestJoinTribe',
            },
            {
                id: 4,
                title: 'Invites you to join their Tribe',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'joinTribeInvitation',
            },
            {
                id: 5,
                title: 'Posts in a Tribe you moderate',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'postsInTribe',
            },
            {
                id: 6,
                title: 'Tribe posts by Admins',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'adminPosts',
            },
            {
                id: 7,
                title: 'Tribe posts by Members',
                pushNotification: true,
                email: false,
                sms: false,
                key: 'memberPosts',
            },
        ],
    },
    // {
    //     id: 7,
    //     title: 'Accountability',
    //     key: 'accountability',
    //     data: [
    //         {
    //             id: 1,
    //             title: 'Asking you to be AB',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 2,
    //             title: 'Wants to hold you accountable for your goals',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 3,
    //             title: 'Accountability Session confirmed',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 4,
    //             title: 'Accountability 1 day reminder',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 5,
    //             title: 'Accountability session now',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 6,
    //             title: 'Accountability rescheduled',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //         {
    //             id: 7,
    //             title: 'Accountability canceled',
    //             pushNotification: true,
    //             email: true,
    //             sms: true,
    //         },
    //     ],
    // },
    {
        id: 7,
        title: 'Productivity',
        key: 'productivity',
        data: [
            {
                id: 1,
                title: 'Reminders for Bronze Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForBronzeBadge',
            },
            {
                id: 2,
                title: 'Reminder of Silver Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForGoldBadge',
            },
            {
                id: 3,
                title: 'Reminder of Gold Challenge',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForSilverBadge',
            },
            {
                id: 4,
                title: 'Reminder to Set 1st Goal',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForFirstGoal',
            },
            {
                id: 5,
                title: 'Reminder to Set New Goals Every 14 days',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForNewGoals',
            },
            {
                id: 6,
                title: 'Reminder to Update Goal Once a week',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'reminderForUpdateGoal',
            },
            {
                id: 7,
                title: 'Friend added a new goal (max 1/day)',
                pushNotification: true,
                email: true,
                sms: true,
                key: 'friendsNewGoal',
            },
            {
                id: 8,
                title: 'New Tribe messages posted',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'newTribeMessage',
            },
            {
                id: 9,
                title: 'You have unread messages',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'reminderForUnreadMessages',
            },
        ],
    },
    {
        id: 8,
        title: 'Chat conversations',
        key: 'chatConversation',
        data: [
            {
                id: 1,
                title: 'Upon receiving a Chat message ',
                pushNotification: true,
                email: true,
                sms: false,
                key: 'chatMessageReceived',
            },
            // {
            //     id: 2,
            //     title: 'Messages Daily Summary ',
            //     pushNotification: null,
            //     email: true,
            //     sms: null,
            // },
            // {
            //     id: 3,
            //     title: 'Messages Daily Summary ',
            //     pushNotification: null,
            //     email: true,
            //     sms: null,
            // },
        ],
    },
    // {
    //     id: 10,
    //     title: 'What you’ve missed - email report',
    //     key: 'emailReport',
    // },
    // {
    //     id: 11,
    //     title: 'Goal Reminders',
    //     key: 'goalReminder',
    // },
]