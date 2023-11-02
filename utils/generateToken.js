import jwt from 'jsonwebtoken';
export const tokenTypes = {
    accessToken:'access_token',
    refreshToken:'refresh_token'
}
export const generateToken = (type, email) => {
    let token;
    switch (type.toLowerCase()) {
        case tokenTypes.refreshToken: {
            token = jwt.sign({ email }, process.env.SECRET_KEY_REFRESH, { expiresIn: '14d' });
            break;
        }
        case tokenTypes.accessToken: {
            token = jwt.sign({ email }, process.env.SECRET_KEY_ACCESS, { expiresIn: '30s' });
            break;
        }
        default: {
            token = jwt.sign({ email }, process.env.SECRET_KEY_ACCESS, { expiresIn: '30s' });
        }
    }
    return token;
};

export const validateToken = (token, type) => {
    let decoded;
    if (!token || ![tokenTypes.accessToken, tokenTypes.refreshToken].includes(type)) {
        return null;
    }

    try {
        if (type === tokenTypes.accessToken) {
            decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
        } else {
            decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH);
        }
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return 'expired';
        }
        return null;
    }
}