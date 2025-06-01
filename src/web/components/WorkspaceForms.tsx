import '../style/WorkspaceForms.css'

interface IShipment {
  id: string
  buildNumber: string
  description: string
  orderNumber: string
  cost: string
}

const WorkspaceForms = ({
  addingShipment,
  newShipment,
  setNewShipment,
  handleAddShipment,
  addingTable,
  newBuildNumber,
  setNewBuildNumber,
  handleSubmit,
}: {
  addingShipment: boolean
  newShipment: IShipment
  setNewShipment: (shipment: IShipment) => void
  handleAddShipment: () => void
  addingTable: boolean
  newBuildNumber: string
  setNewBuildNumber: (buildNumber: string) => void
  handleSubmit: () => void
}) => (
  <div className="WorkspaceDetails__forms">
    <div className="WorkspaceDetails__table__form">
      <input
        type="text"
        placeholder="Build Number"
        value={newBuildNumber}
        onChange={(e) => setNewBuildNumber(e.target.value)}
        required
      />
      <button disabled={!newBuildNumber || addingTable} type="submit" onClick={handleSubmit}>
        {addingTable ? 'Adding...' : 'Add Table'}
      </button>
    </div>
    {newShipment.buildNumber && (
      <div className="WorkspaceDetails__shipment__form">
        <input
          disabled={true}
          type="text"
          name="buildNumber"
          placeholder="Build Number"
          value={newShipment.buildNumber}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newShipment.description}
          onChange={(e) => setNewShipment({ ...newShipment, [e.target.name]: e.target.value })}
          required
          style={{ width: '100%' }}
        />
        <input
          type="text"
          name="orderNumber"
          placeholder="Order Number"
          value={newShipment.orderNumber}
          onChange={(e) => setNewShipment({ ...newShipment, [e.target.name]: e.target.value })}
          required
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={newShipment.cost}
          onChange={(e) => setNewShipment({ ...newShipment, [e.target.name]: e.target.value })}
          required
          style={{ width: '50px' }}
        />
        <button
          type="submit"
          disabled={
            !newShipment.buildNumber ||
            !newShipment.description ||
            !newShipment.orderNumber ||
            !newShipment.cost ||
            addingShipment
          }
          onClick={handleAddShipment}
        >
          {addingShipment ? 'Saving...' : 'Save Shipment'}
        </button>
      </div>
    )}
  </div>
)

export default WorkspaceForms
