import { parse } from 'cookie';


const VerifyCookies = async (context) => {
    const { req } = context;

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.ResumeToken;

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    console.log(token, "token")

    // Verify token with your backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}verifyToken`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": token,
        },
    });

    const result = await res.json();

    if (!result.success) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    return result
}

export default VerifyCookies