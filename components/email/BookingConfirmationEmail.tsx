import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Section,
    Tailwind,
    Text
} from '@react-email/components'

interface BookingConfirmationEmailProps {
    guestName: string
    classTitle: string
    classDate: string
    classTime: string
    price: string
    linkUrl: string
    tiktokUrl?: string
    instagramUrl?: string
}

export const BookingConfirmationEmail = ({
    guestName,
    classTitle,
    classDate,
    classTime,
    price,
    linkUrl,
    tiktokUrl = 'https://tiktok.com/',
    instagramUrl = 'https://instagram.com/'
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body
                    className="bg-white font-raycast p-4"
                    style={{
                        backgroundColor: '#ebe5e0'
                    }}
                >
                    <Container className="mx-auto my-0 pt-5 px-1 pb-1 bg-secondary-bg max-w-[650px]">
                        <Img
                            src="https://pilates-studio-xi.vercel.app/images/logo.png"
                            width={54}
                            height={54}
                            alt="Pilates Logo"
                            className="flex justify-center mx-auto"
                        />
                        <Heading className="text-[26px] font-bold mt-12 text-center">
                            🎉 Your Pilates Booking is Confirmed!
                        </Heading>

                        <Text className="text-base mt-4 text-center">
                            Hi {guestName}, thanks for booking a Pilates class
                            with us!
                        </Text>

                        <Section className="mt-6 p-3 flex justify-center">
                            <Text className="text-base leading-6">
                                <strong>Class:</strong> {classTitle}
                            </Text>
                            <Text className="text-base leading-6">
                                <strong>Date & Time:</strong> {classDate} at{' '}
                                {classTime}
                            </Text>
                            <Text className="text-base leading-6">
                                <strong>Price:</strong> {price}
                            </Text>
                            <Text className="leading-6 mt-2 italic text-gray-600 text-sm">
                                Free cancellation if you cancel atleast 24h
                                before class start
                            </Text>
                        </Section>

                        <Section className="mt-6 text-center">
                            <Text className="text-base mb-2">
                                Follow us on social media:
                            </Text>
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={tiktokUrl}
                                    className="text-black underline"
                                >
                                    TikTok
                                </Link>
                                <Link
                                    href={instagramUrl}
                                    className="text-black underline"
                                >
                                    Instagram
                                </Link>
                            </div>
                        </Section>

                        <Section className="mt-10 flex justify-center">
                            <Link
                                className="text-white text-center bg-btn rounded-lg p-4"
                                style={{
                                    backgroundColor: '#704f44'
                                }}
                                href={linkUrl}
                            >
                                Click here to see all classes
                            </Link>
                        </Section>

                        <Section className="mt-10 flex justify-center">
                            <table
                                role="presentation"
                                style={{ borderCollapse: 'collapse' }}
                            >
                                <tbody>
                                    <tr>
                                        <td
                                            style={{
                                                paddingRight: '8px',
                                                verticalAlign: 'middle'
                                            }}
                                        >
                                            <Img
                                                src="https://pilates-studio-xi.vercel.app/images/logo.png"
                                                width={30}
                                                height={30}
                                                alt="Pilates Logo"
                                                style={{ display: 'block' }}
                                            />
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <Text className="text-base leading-6.5">
                                                Best,
                                                <br />- Pilates Team
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        <Hr className="border-[#dddddd] mt-12" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default BookingConfirmationEmail
