import { createEmergency } from '../api/emergencyApi'

import {
  getPendingEmergencies,
  deletePendingEmergency
} from './offlineEmergencyDB'


const syncPendingEmergencies = async () => {
  try {
    const pendingEmergencies =
      await getPendingEmergencies()

    if (pendingEmergencies.length === 0) {
      return []
    }


    const syncedEmergencies = []


    for (const pending of pendingEmergencies) {
      try {

        const emergencyData = {
          type: pending.type,
          severity: pending.severity,
          description: pending.description || '',
          location: pending.location || ''
        }


        const data = await createEmergency(
          emergencyData
        )


        /*
          Server successfully created the
          emergency.

          Now remove the local pending record.
        */

        await deletePendingEmergency(
          pending.id
        )


        syncedEmergencies.push(
          data.emergency
        )

      } catch (error) {

        console.error(
          'Emergency sync failed:',
          error.message
        )

        /*
          Do NOT delete the pending record
          if sync failed.

          It will be retried next time.
        */

      }
    }


    return syncedEmergencies

  } catch (error) {

    console.error(
      'Pending emergency sync error:',
      error.message
    )

    return []
  }
}


export default syncPendingEmergencies