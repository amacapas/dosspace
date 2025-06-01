import { all, findOne, insert, update } from './db/db'
import { Workspace, Shipment } from './types'
import { v4 as uuidv4 } from 'uuid'

/** Returns a list of all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns a single workspace from the database */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

/** Create a workspace in the database */
export function createWorkspace(dbString: string): Workspace {
  const workspace: Workspace = {
    id: uuidv4(),
    title: '',
    buildShipments: [
      {
        id: uuidv4(),
        buildNumber: '',
        // Initialize the workspace with a single empty build shipment
        shipments: [{ id: uuidv4(), description: '', orderNumber: '', cost: 0 }],
      },
    ],
  }
  insert(dbString, 'workspaces', workspace)
  return workspace
}

/** Update a workspace in the database */
export function updateWorkspace(dbString: string, workspace: Workspace): Workspace {
  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Add a table to a workspace */
export function addTableToWorkspace(dbString: string, workspaceId: string, buildNumber: string) {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  const newTable = {
    id: uuidv4(),
    buildNumber,
    shipments: [],
  }
  workspace.buildShipments.push(newTable)
  update(dbString, 'workspaces', workspaceId, workspace)
  return newTable
}

/** Add a shipment to a table */
export function addShipmentToTable(
  dbString: string,
  workspaceId: string,
  tableId: string,
  shipment: Shipment
) {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  const table = workspace.buildShipments.find((t) => t.id === tableId)
  if (!table) throw new Error('Table not found')

  table.shipments.push(shipment)
  update(dbString, 'workspaces', workspaceId, workspace)
  return shipment
}
