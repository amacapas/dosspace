import axios from 'axios'
import { DetailWorkspace, Shipment } from './components/WorkspaceDetails'

const BASE_URL = 'http://localhost:8080'

/** The API for the app, for querying, creating and updating workspaces */
class DosspaceApi {
  /** Returns the ID and title of every existing workspace */
  static async getWorkspaces() {
    try {
      const req = await axios.get(BASE_URL)
      const { workspaces } = req.data
      return workspaces
    } catch (err) {
      throw new Error('Unable to fetch workspaces')
    }
  }

  /** Returns the details about the given workspace ID */
  static async getWorkspace(workspaceId: string): Promise<DetailWorkspace> {
    try {
      const req = await axios.get(`${BASE_URL}/${workspaceId}`)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to fetch workspace')
    }
  }

  /** Add a table to a workspace */
  static async addTableToWorkspace(workspaceId: string, buildNumber: string) {
    try {
      const req = await axios.post(`${BASE_URL}/${workspaceId}/table`, { buildNumber })
      return req.data.table
    } catch (err) {
      throw new Error('Unable to add table to workspace')
    }
  }

  /** Add a shipment to a table */
  static async addShipmentToTable(
    workspaceId: string,
    tableId: string,
    shipment: Partial<Shipment>
  ) {
    try {
      const req = await axios.post(`${BASE_URL}/${workspaceId}/table/${tableId}/shipment`, shipment)
      return req.data.shipment
    } catch (err) {
      throw new Error('Unable to add shipment to table')
    }
  }
}

export default DosspaceApi
