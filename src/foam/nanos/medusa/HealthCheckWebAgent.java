/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.nanos.medusa;

import foam.core.X;
import foam.nanos.http.WebAgent;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
   Health check web agent, intented to be called by load balancers
   to add/remove targets from target group.
   Responses from haproxy.org
 */
public class HealthCheckWebAgent
  implements WebAgent
{
  @Override
  public void execute(X x) {
    PrintWriter         out      = x.get(PrintWriter.class);
    HttpServletResponse response = x.get(HttpServletResponse.class);

    response.setContentType("text/plain");

    ClusterConfigSupport support = (ClusterConfigSupport) x.get("clusterConfigSupport");

    if ( support != null ) {
      ElectoralService electoral = (ElectoralService) x.get("electoralService");
      ClusterConfig config = (ClusterConfig) ((foam.dao.DAO) x.get("clusterConfigDAO")).find(support.getConfigId());
      ReplayingInfo info = config.getReplayingInfo();

      if ( ! config.getEnabled() ) {
        response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        out.println("down\n");
      } else {
        if ( config.getType() == MedusaType.MEDIATOR ) {
          if ( config.getStatus() == Status.ONLINE &&
               config.getRegionStatus() == RegionStatus.ACTIVE &&
               ( config.getZone() > 0 ||
                 ( config.getZone() == 0 &&
                   electoral.getState() == ElectoralServiceState.IN_SESSION ) ) ) {
            response.setStatus(HttpServletResponse.SC_OK);
            out.println("up\n");
          } else if ( config.getStatus() != Status.ONLINE &&
                      config.getRegionStatus() == RegionStatus.ACTIVE &&
                      config.getZone() == 0 &&
                      info != null ) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            if ( ! foam.util.SafetyUtil.isEmpty(config.getErrorMessage()) ) {
              out.println("failed\n");
              out.println("error: "+config.getErrorMessage());
            } else {
              out.println("maint\n");
              out.println("replaying: "+info.getReplaying()+"\n");
              out.println("timeRemaining: "+info.getTimeRemaining()+"\n");
              out.println("percentComplete: "+info.getPercentComplete()+"\n");
            }
          } else {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            out.println("maint\n");
          }
        } else if ( config.getStatus() == Status.ONLINE &&
                    config.getRegionStatus() == RegionStatus.ACTIVE ) {
          response.setStatus(HttpServletResponse.SC_OK);
          out.println("up\n");
        } else {
          response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
          out.println("maint\n");
        }
      }
    } else {
      response.setStatus(HttpServletResponse.SC_OK);
      out.println("up\n");
    }
  }
}
