import React from 'react';
import Modal from '../Common/Modal.jsx';

const TeamDetails = ({ team, onClose }) => {
  if (!team) {
    return null;
  }

  return (
    <div className="team-details-modal">
      <div className="modal-content">
        <section className="team-owners-section">
          
          <h3>Team Owners</h3>
          <ul className="list-group mb-3">
            {team.owners && team.owners.length > 0 ? (
              team.owners.map((ownerName, index) => (
                <li key={index} className="list-group-item">
                  {ownerName}
                </li>
              ))
            ) : (
              <li className="list-group-item">No owners assigned directly to this team.</li>
            )}
          </ul>
        </section>

        <section className="team-description-section mt-4">
          <h3>Description</h3>
          {team.description ? (
            <p>{team.description}</p>
          ) : (
            <p className="text-muted">No description available.</p>
          )}
        </section>

        <div className="form-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;