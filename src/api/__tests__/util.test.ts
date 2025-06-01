import * as utils from '../util'
import { reset } from '../db/db'
import mock from 'mock-fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const testDbString = '../database.test.txt'

describe('Util tests', () => {
  function createMockUuid() {
    // Creates random unique ID for a mock object
    return uuidv4()
  }

  const workspaceId = createMockUuid()

  beforeEach(() => {
    mock({ [path.resolve(__dirname, testDbString)]: '' })
    reset(testDbString, workspaceId)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getWorkspaces', () => {
    it('returns the workspaces from the db', () => {
      const workspaces = utils.getWorkspaces(testDbString)
      expect(workspaces).toBeDefined()
      expect(workspaces).toHaveLength(1)
      expect(workspaces[0].id).toBe(workspaceId)
      expect(workspaces[0].title).toEqual("Wiley's Shipping")
      expect(workspaces[0].buildShipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].buildNumber).toEqual('A82D2-108')
      expect(workspaces[0].buildShipments[0].shipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].shipments[0].description).toEqual('64 units')
    })
  })

  describe('getWorkspace', () => {
    it('returns the queried workspace from the db', () => {
      const workspace = utils.getWorkspace(testDbString, workspaceId)
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual("Wiley's Shipping")
      expect(workspace.buildShipments).toHaveLength(1)
    })
  })

  describe('createWorkspace', () => {
    it('creates a new workspace', () => {
      const workspace = utils.createWorkspace(testDbString)
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual('')
      expect(workspace.buildShipments).toHaveLength(1)
      expect(workspace.buildShipments[0].shipments).toHaveLength(1)
      expect(workspace.buildShipments[0].buildNumber).toEqual('')
      expect(workspace.buildShipments[0].shipments[0].description).toEqual('')
    })
  })

  describe('updateWorkspace', () => {
    it('updates a workspace', () => {
      const workspace = utils.createWorkspace(testDbString)
      workspace.title = "Arnav's Shipping"
      utils.updateWorkspace(testDbString, workspace)
      const updatedWorkspace = utils.getWorkspace(testDbString, workspace.id)
      expect(updatedWorkspace.title).toEqual("Arnav's Shipping")
    })
  })

  describe('addTableToWorkspace', () => {
    it('adds a new table to a workspace', () => {
      const workspace = utils.createWorkspace(testDbString)
      const buildNumber = 'TEST-123'
      const newTable = utils.addTableToWorkspace(testDbString, workspace.id, buildNumber)
      
      expect(newTable.buildNumber).toEqual(buildNumber)
      expect(newTable.shipments).toEqual([])
      
      const updatedWorkspace = utils.getWorkspace(testDbString, workspace.id)
      expect(updatedWorkspace.buildShipments).toHaveLength(2) // 1 default + 1 new
      expect(updatedWorkspace.buildShipments[1].buildNumber).toEqual(buildNumber)
    })
  })

  describe('addShipmentToTable', () => {
    it('adds a new shipment to a table', () => {
      const workspace = utils.createWorkspace(testDbString)
      const table = workspace.buildShipments[0]
      const shipment = {
        id: createMockUuid(),
        description: 'Test Shipment',
        orderNumber: 'ORD-123',
        cost: 1999 // $19.99
      }
      
      const newShipment = utils.addShipmentToTable(testDbString, workspace.id, table.id, shipment)
      
      expect(newShipment.description).toEqual(shipment.description)
      expect(newShipment.orderNumber).toEqual(shipment.orderNumber)
      expect(newShipment.cost).toEqual(shipment.cost)
      
      const updatedWorkspace = utils.getWorkspace(testDbString, workspace.id)
      const updatedTable = updatedWorkspace.buildShipments.find(t => t.id === table.id)
      expect(updatedTable?.shipments).toHaveLength(2) // 1 default + 1 new
      expect(updatedTable?.shipments[1].description).toEqual(shipment.description)
    })
  })
})
