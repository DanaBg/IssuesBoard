'use client';

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { Issue } from "./types/issue";
import { Alert, CircularProgress, Snackbar } from "@mui/material";

export default function Home() {
  const [issues, setIssues]= useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/issues`);
        const data: Issue[] = await response.json();
        setIssues(data);
      } catch (error) {
        setIsError(true);
        console.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className={styles.page}>
      LakeFS Issues
      <main className={styles.main}>
      {isError ? <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">Error fetching issues</Alert>
        </Snackbar> :
        isLoading ? <CircularProgress color="success" /> :
        issues?.map((issue: Issue) => (
          <Accordion key={issue.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              {`#${issue.number} - ${issue.title}`}
            </AccordionSummary>
            <AccordionDetails>
              {issue.body}
            </AccordionDetails>
          </Accordion>
        ))}
      
      </main>
    </div>
  );
}
