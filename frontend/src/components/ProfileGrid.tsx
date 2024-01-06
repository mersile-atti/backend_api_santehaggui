import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client';

interface emergencyProfile {
    id: number;
    name: string;
    gender: string;
    photoUrl: string;
}

interface FetchHealthRecordsProfile {
    results: emergencyProfile[]
}
const ProfileGrid = () => {
    const [emergencyProfiles, setEmergencyProfiles] = useState<emergencyProfile[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get<FetchHealthRecordsProfile>('/healthRecords')
        .then(res => setEmergencyProfiles(res.data.results))
        .catch(err => setError(err.message))
    })
  return (
    <ul>
        {emergencyProfiles.map(emergencyProfile => (
            <li key={emergencyProfile.id}>{emergencyProfile.name}</li>
        ))}</ul>
  )
}

export default ProfileGrid