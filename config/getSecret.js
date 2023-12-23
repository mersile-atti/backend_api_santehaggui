const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretName = "prod/myserverbackend/santehaggui";
const client = new SecretsManagerClient({ region: "us-east-1" });

async function getSecret() {
    try {
        const response = await client.send(new GetSecretValueCommand({ SecretId: secretName, VersionStage: "AWSCURRENT" }));
        return response.SecretString;
    } catch (error) {
        throw error;
    }
}

module.exports = { getSecret };