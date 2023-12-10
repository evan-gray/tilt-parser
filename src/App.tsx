import { FilterAlt } from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

function App() {
  const [output, setOutput] = useState("");
  const handleOutputChange = useCallback((ev: any) => {
    setOutput(ev.target.value);
  }, []);
  const [selectedGroup, setSelectedGroup] = useState("-");
  const handleGroupChange = useCallback((ev: any) => {
    setSelectedGroup(ev.target.value);
  }, []);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const handleShowTimestampChange = useCallback((ev: any) => {
    setShowTimestamp((v) => !v);
  }, []);
  const [showProbes, setShowProbes] = useState(false);
  const handleShowProbesChange = useCallback((ev: any) => {
    setShowProbes((v) => !v);
  }, []);
  const [filter, setFilter] = useState("");
  const handleFilterChange = useCallback((ev: any) => {
    setFilter(ev.target.value);
  }, []);
  const [allLogs, logsByGroup] = useMemo(() => {
    const allLogs: [string, string][] = [];
    const logsByGroup: { [group: string]: [string, string][] } = {
      "[none]": [],
    };
    const logLines = output.split("\n");
    for (const line of logLines) {
      const [timestamp, ...rest] = line.split("Z ", 2);
      const [group, ...log] = rest.join("Z ").split(" │ ");
      if (log.length === 0) {
        const l: [string, string] = [`${timestamp}Z`, group];
        allLogs.push(l);
        logsByGroup["[none]"].push(l);
      } else {
        const g = group.trim();
        if (!logsByGroup[g]) {
          logsByGroup[g] = [];
        }
        const l: [string, string] = [`${timestamp}Z`, log.join(" │ ")];
        allLogs.push(l);
        logsByGroup[g].push(l);
      }
    }
    return [allLogs, logsByGroup];
  }, [output]);
  const groupKeys = Object.keys(logsByGroup).sort();
  const filteredLogs = useMemo(() => {
    const f = filter.toLowerCase();
    return (
      selectedGroup === "-" ? allLogs : logsByGroup[selectedGroup]
    ).filter(
      ([_, log]) =>
        (f === "" || log.toLowerCase().includes(f)) &&
        (showProbes ||
          !(
            log.startsWith("[event: pod ") &&
            log.includes("] Readiness probe failed:")
          ))
    );
  }, [selectedGroup, allLogs, logsByGroup, filter, showProbes]);
  return (
    <Box sx={{ p: 2, height: "100vh", maxHeight: "100vh" }}>
      {output === "" ? (
        <>
          <TextField
            value={output}
            onChange={handleOutputChange}
            multiline
            rows={10}
            fullWidth
            placeholder="Paste Tilt logs here..."
            helperText={`After a Tilt CI job has finished, click the gear in the top right
            and select "View raw logs". Copy all of the logs and paste them above.`}
          />
        </>
      ) : (
        <Box display="flex" flexDirection="column" maxHeight="100%">
          <TextField
            value={selectedGroup}
            onChange={handleGroupChange}
            select
            fullWidth
            sx={{ mb: 2 }}
            placeholder="All"
            size="small"
          >
            <MenuItem value={"-"}>All ({allLogs.length})</MenuItem>
            {groupKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {key} ({logsByGroup[key].length})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            value={filter}
            onChange={handleFilterChange}
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAlt />
                </InputAdornment>
              ),
            }}
            placeholder="Filter"
            size="small"
            sx={{ mb: 2 }}
          />
          <FormGroup sx={{ mb: 2, mx: 1, flexDirection: "row" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showTimestamp}
                  onChange={handleShowTimestampChange}
                  size="small"
                />
              }
              label="Timestamps"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showProbes}
                  onChange={handleShowProbesChange}
                  size="small"
                />
              }
              label="Probes"
            />
          </FormGroup>
          <Box overflow={"auto"} sx={{ "& > pre": { fontSize: "75%", m: 0 } }}>
            {filteredLogs.map(([timestamp, log]) => (
              <pre key={timestamp}>
                {showTimestamp ? `${timestamp} | ` : ""}
                {log}
              </pre>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
