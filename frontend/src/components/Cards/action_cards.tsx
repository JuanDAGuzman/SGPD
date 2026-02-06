import React from "react";
import styles from "./action_cards.module.css"

interface ActionCardProps {
    icon: React.ReactNode
    title: string
    onClick?: () => void
}

const ActionCard: React.FC<ActionCardProps> =  ({ icon, title, onClick }) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardTitle}>{title}</div>
        </div>
    )
}

export default ActionCard