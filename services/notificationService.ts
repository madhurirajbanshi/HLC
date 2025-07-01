export type Notification = {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    type: 'normal' | 'urgent' | 'info' | 'ytube';
    read: boolean;
    published: boolean; 
    imageUrl?: string; // Optional field for image URL
    link?: string; // Optional field for a link to more details
}


const notifications: Notification[] = [
    {
        id: '1',
        title: 'Welcome to HLC',
        message: 'Thank you for joining us! We are excited to have you on board.',
        timestamp: new Date(),
        type: 'normal',
        read: false,
        published: true,
    },
    {
        id: '2',
        title: 'New Features Available',
        message: 'Check out the latest features we have added to enhance your experience.',
        timestamp: new Date(),
        type: 'info',
        read: false,
        published: true,
    },
    {
        id: '3',
        title: 'Live Lottery Draw',
        message: 'Join us for the live lottery draw happening today at 5 PM.',
        link: 'https://www.youtube.com/watch?v=C4SOe_0jLr0&t=2891s&ab_channel=ULCElectronicsPvt.Ltd',
        imageUrl: 'https://i.ytimg.com/vi/C4SOe_0jLr0/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGFQgXShlMA8=&rs=AOn4CLBmrjREN8EmWBfMfeGzylp5deJtlA',
        timestamp: new Date(),
        type: 'ytube',
        read: false,
        published: true
    },
    {
        id: '4',
        title: 'Order Confirmation',
        message: 'Your order #12345 has been confirmed and will be shipped soon.',
        timestamp: new Date(),
        type: 'normal',
        read: true,
        published: true,
    }
];




// export const getNotifications = async (): Promise<Notification[]> => {
//     try {
//         const response = await fetch('https://api.example.com/notifications');
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data: Notification[] = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         return [];
//     }
// }
