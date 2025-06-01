import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DosspaceApi from '../api'

import WorkspaceForms from './WorkspaceForms'

import '../style/WorkspaceDetails.css'

export interface Shipment {
  id: string
  description: string
  orderNumber: string
  cost: number
}

interface ShipmentTable {
  id: string
  buildNumber: string
  shipments: Shipment[]
}

export interface DetailWorkspace {
  id: string
  title: string
  buildShipments: ShipmentTable[]
}

type WorkspaceDetailsParams = {
  workspaceId: string
}

const defaultShipment = {
  id: '',
  buildNumber: '',
  description: '',
  orderNumber: '',
  cost: '',
}

/** Detail view of individual workspace */
export default function WorkspaceDetails() {
  const { workspaceId } = useParams() as WorkspaceDetailsParams
  const [workspace, setWorkspace] = useState<DetailWorkspace | null>(null)
  const [addingTable, setAddingTable] = useState(false)
  const [addingShipment, setAddingShipment] = useState(false)
  const [newBuildNumber, setNewBuildNumber] = useState('')
  const [newShipment, setNewShipment] = useState(defaultShipment)

  // Fetch all workspaces from the API
  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(workspace)
    }

    fetchWorkspace()
  }, [workspaceId])

  async function handleAddTable() {
    setAddingTable(true)
    try {
      await DosspaceApi.addTableToWorkspace(workspaceId, newBuildNumber)
      const updated = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(updated)
      setNewBuildNumber('')
    } finally {
      setAddingTable(false)
    }
  }

  async function handleAddShipment() {
    setAddingShipment(true)
    try {
      await DosspaceApi.addShipmentToTable(workspaceId, newShipment.id, {
        description: newShipment.description,
        orderNumber: newShipment.orderNumber,
        cost: Math.round(parseFloat(newShipment.cost) * 100), // Convert to cents
      })
      const updated = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(updated)
      setNewShipment(defaultShipment)
    } finally {
      setAddingShipment(false)
    }
  }

  if (!workspace) return <div>Loading...</div>

  return (
    <div className="WorkspaceDetails">
      <h2>Workspace: {workspace.title}</h2>
      <div className="worspaceDetails_wrapper">
        <div className="WorkspaceDetails__table">
          <div className="WorkspaceDetails__header">
            <div>Build Number</div>
            <div>Shipment Details</div>
          </div>
          {[...workspace.buildShipments].reverse().map((data) => (
            <div key={data.id} className="WorkspaceDetails__row">
              <div className="WorkspaceDetails__row__cols">
                <span>{data.buildNumber}</span>
                <button
                  type="submit"
                  onClick={() =>
                    setNewShipment({ ...newShipment, id: data.id, buildNumber: data.buildNumber })
                  }
                >
                  Add Shipment
                </button>
              </div>
              {data.shipments.length ? (
                <div className="WorkspaceDetails__row__cols">
                  {data.shipments.map((shipment) => (
                    <div key={shipment.id} className="WorkspaceDetails__row__shipment">
                      {shipment.description}
                      <span>Order: {shipment.orderNumber}</span>
                      <span>Cost: ${shipment.cost / 100}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <em>No shipments found</em>
              )}
            </div>
          ))}
        </div>
        <WorkspaceForms
          addingShipment={addingShipment}
          newShipment={newShipment}
          setNewShipment={setNewShipment}
          handleAddShipment={handleAddShipment}
          addingTable={addingTable}
          newBuildNumber={newBuildNumber}
          setNewBuildNumber={setNewBuildNumber}
          handleSubmit={handleAddTable}
        />
      </div>
    </div>
  )
}
